// Pyodide Web Worker — chạy code Python trong browser, sandboxed.
// Load Pyodide từ CDN để giữ bundle nhẹ.
self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

let pyodideReadyPromise = null;

async function loadPyodideOnce() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = self
      .loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      })
      .then((py) => {
        py.setStdout({
          batched: (text) => {
            self.postMessage({ type: "stdout", text });
          },
        });
        py.setStderr({
          batched: (text) => {
            self.postMessage({ type: "stderr", text });
          },
        });
        return py;
      });
  }
  return pyodideReadyPromise;
}

self.onmessage = async (event) => {
  const { id, type, code, stdin } = event.data;

  if (type === "warmup") {
    try {
      await loadPyodideOnce();
      self.postMessage({ id, type: "ready" });
    } catch (err) {
      self.postMessage({ id, type: "error", error: String(err) });
    }
    return;
  }

  if (type === "run") {
    try {
      const pyodide = await loadPyodideOnce();

      if (typeof stdin === "string" && stdin.length > 0) {
        pyodide.setStdin({
          stdin: () => null,
          // Pre-load stdin via globals so input() works
          // Simpler approach: monkeypatch input() with provided lines
        });
        const lines = stdin.split("\n");
        pyodide.globals.set("__pykids_stdin_lines__", lines);
        await pyodide.runPythonAsync(`
import builtins
__pykids_idx__ = [0]
__pykids_lines__ = list(__pykids_stdin_lines__)
def __pykids_input__(prompt=""):
    i = __pykids_idx__[0]
    __pykids_idx__[0] = i + 1
    if i < len(__pykids_lines__):
        return __pykids_lines__[i]
    raise EOFError("Hết dữ liệu nhập")
builtins.input = __pykids_input__
`);
      }

      await pyodide.runPythonAsync(code);
      self.postMessage({ id, type: "done" });
    } catch (err) {
      self.postMessage({
        id,
        type: "error",
        error: err?.message ?? String(err),
      });
    }
  }
};
