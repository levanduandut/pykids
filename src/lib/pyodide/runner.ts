"use client";

export type RunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  durationMs: number;
};

export type TestCase = {
  type: "stdin_stdout" | "function_check" | "custom_script";
  input: string;
  expectedOutput: string;
};

export type TestResult = {
  passed: boolean;
  stdout: string;
  stderr: string;
  error: string | null;
  expected: string;
  hidden?: boolean;
};

const DEFAULT_TIMEOUT_MS = 5000;

class PyodideClient {
  private worker: Worker | null = null;
  private warmupPromise: Promise<void> | null = null;
  private msgId = 0;

  private ensureWorker(): Worker {
    if (typeof window === "undefined") {
      throw new Error("PyodideClient only runs in the browser");
    }
    if (!this.worker) {
      this.worker = new Worker("/pyodide-worker.js");
    }
    return this.worker;
  }

  warmup(): Promise<void> {
    if (this.warmupPromise) return this.warmupPromise;
    const worker = this.ensureWorker();
    const id = ++this.msgId;

    this.warmupPromise = new Promise<void>((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data?.id !== id) return;
        worker.removeEventListener("message", handler);
        if (e.data.type === "ready") resolve();
        else reject(new Error(e.data.error ?? "Pyodide warmup failed"));
      };
      worker.addEventListener("message", handler);
      worker.postMessage({ id, type: "warmup" });
    });
    return this.warmupPromise;
  }

  async run(
    code: string,
    opts: { stdin?: string; timeoutMs?: number } = {},
  ): Promise<RunResult> {
    const worker = this.ensureWorker();
    await this.warmup();

    const id = ++this.msgId;
    const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const startedAt = performance.now();

    let stdout = "";
    let stderr = "";

    return new Promise<RunResult>((resolve) => {
      const timeout = setTimeout(() => {
        worker.removeEventListener("message", handler);
        this.terminate();
        resolve({
          stdout,
          stderr,
          error: `Hết thời gian chạy (${timeoutMs}ms). Có thể bạn lỡ tạo vòng lặp vô hạn?`,
          durationMs: performance.now() - startedAt,
        });
      }, timeoutMs);

      const handler = (e: MessageEvent) => {
        const data = e.data;
        if (data?.id !== id && data?.type !== "stdout" && data?.type !== "stderr")
          return;
        if (data.type === "stdout") stdout += data.text;
        else if (data.type === "stderr") stderr += data.text;
        else if (data.type === "done") {
          clearTimeout(timeout);
          worker.removeEventListener("message", handler);
          resolve({
            stdout,
            stderr,
            error: null,
            durationMs: performance.now() - startedAt,
          });
        } else if (data.type === "error") {
          clearTimeout(timeout);
          worker.removeEventListener("message", handler);
          resolve({
            stdout,
            stderr,
            error: data.error,
            durationMs: performance.now() - startedAt,
          });
        }
      };

      worker.addEventListener("message", handler);
      worker.postMessage({ id, type: "run", code, stdin: opts.stdin ?? "" });
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.warmupPromise = null;
    }
  }
}

let singleton: PyodideClient | null = null;

export function getPyodide(): PyodideClient {
  if (!singleton) singleton = new PyodideClient();
  return singleton;
}

function normalize(s: string): string {
  return s.replace(/\r\n/g, "\n").trimEnd();
}

export async function gradeAgainstTests(
  code: string,
  tests: TestCase[],
): Promise<TestResult[]> {
  const py = getPyodide();
  const results: TestResult[] = [];

  for (const t of tests) {
    if (t.type === "stdin_stdout") {
      const res = await py.run(code, { stdin: t.input });
      const passed =
        res.error === null &&
        normalize(res.stdout) === normalize(t.expectedOutput);
      results.push({
        passed,
        stdout: res.stdout,
        stderr: res.stderr,
        error: res.error,
        expected: t.expectedOutput,
      });
    } else if (t.type === "function_check") {
      const wrapped = `${code}\n\n${t.input}`;
      const res = await py.run(wrapped);
      results.push({
        passed: res.error === null,
        stdout: res.stdout,
        stderr: res.stderr,
        error: res.error,
        expected: "assertions pass",
      });
    } else if (t.type === "custom_script") {
      const wrapped = `${code}\n\n${t.input}`;
      const res = await py.run(wrapped);
      const passed =
        res.error === null &&
        (t.expectedOutput.length === 0 ||
          normalize(res.stdout) === normalize(t.expectedOutput));
      results.push({
        passed,
        stdout: res.stdout,
        stderr: res.stderr,
        error: res.error,
        expected: t.expectedOutput,
      });
    }
  }

  return results;
}
