"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getPyodide } from "@/lib/pyodide/runner";

const STARTER = `# Chào mừng bạn đến với PyKids!
# Hãy thử chạy đoạn code Python này nhé.

ten = "bạn"
tuoi = 10

print(f"Xin chào, {ten}!")
print(f"Bạn {tuoi} tuổi rồi à? Tuyệt quá!")

# Tính tổng 1 + 2 + ... + 10
tong = 0
for i in range(1, 11):
    tong += i
print(f"Tổng từ 1 đến 10 là: {tong}")
`;

export default function PlaygroundPage() {
  const [code, setCode] = useState(STARTER);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Đang khởi động Python...");
  const warmedUp = useRef(false);

  useEffect(() => {
    if (warmedUp.current) return;
    warmedUp.current = true;
    const py = getPyodide();
    py.warmup()
      .then(() => {
        setReady(true);
        setLoadingMsg("");
      })
      .catch((e) => {
        setLoadingMsg(`Lỗi tải Python: ${e.message}`);
      });
  }, []);

  async function handleRun() {
    setRunning(true);
    setOutput("");
    setError(null);
    const py = getPyodide();
    const res = await py.run(code, { stdin });
    setOutput(res.stdout + (res.stderr ? `\n${res.stderr}` : ""));
    setError(res.error);
    setRunning(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="font-bold">
            🐍 PyKids
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span
              className={
                ready
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500"
              }
            >
              {ready ? "● Python sẵn sàng" : loadingMsg || "● Đang tải..."}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        <section className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <h2 className="text-sm font-medium">Code Python</h2>
            <Button
              size="sm"
              onClick={handleRun}
              disabled={!ready || running}
            >
              {running ? "Đang chạy..." : "▶ Chạy"}
            </Button>
          </div>
          <div className="flex-1">
            <CodeEditor value={code} onChange={setCode} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
              <h2 className="text-sm font-medium">Kết quả</h2>
            </div>
            <pre className="flex-1 overflow-auto p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200">
              {output || (running ? "..." : "Nhấn ▶ Chạy để xem kết quả")}
              {error && (
                <span className="block mt-2 text-rose-600 dark:text-rose-400">
                  {error}
                </span>
              )}
            </pre>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
              <h2 className="text-sm font-medium">
                Dữ liệu nhập (mỗi dòng = 1 input())
              </h2>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Để trống nếu code không dùng input()"
              className="h-24 w-full resize-none bg-transparent p-3 font-mono text-sm outline-none"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
