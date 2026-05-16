"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  gradeAgainstTests,
  getPyodide,
  type TestCase as PyTestCase,
  type TestResult,
} from "@/lib/pyodide/runner";
import { friendlyError } from "@/lib/pyodide/friendly-errors";
import { submitExercise } from "@/lib/actions/submissions";

export type PublicTestCase = {
  id: string;
  type: "stdin_stdout" | "function_check" | "custom_script";
  input: string;
  expectedOutput: string;
  hidden: boolean;
  weight: number;
};

type Props = {
  classId: string;
  className: string;
  exerciseId: string;
  title: string;
  description: string;
  difficulty: "cap1" | "cap2";
  starterCode: string;
  initialCode?: string;
  tests: PublicTestCase[];
  bestScore?: number;
};

export function ExerciseSolver({
  classId,
  className,
  exerciseId,
  title,
  description,
  difficulty,
  starterCode,
  initialCode,
  tests,
  bestScore,
}: Props) {
  const router = useRouter();
  const isCap1 = difficulty === "cap1";

  const [code, setCode] = useState(initialCode ?? starterCode);
  const [stdin, setStdin] = useState("");
  const [runOutput, setRunOutput] = useState("");
  const [runError, setRunError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<
    (TestResult & { testCaseId: string; hidden: boolean })[] | null
  >(null);
  const [score, setScore] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [pyReady, setPyReady] = useState(false);
  const warmedUp = useRef(false);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (warmedUp.current) return;
    warmedUp.current = true;
    startedAt.current = Date.now();
    getPyodide()
      .warmup()
      .then(() => setPyReady(true))
      .catch(() => {});
  }, []);

  async function handleRun() {
    setRunning(true);
    setRunOutput("");
    setRunError(null);
    const py = getPyodide();
    const res = await py.run(code, { stdin });
    setRunOutput(res.stdout + (res.stderr ? `\n${res.stderr}` : ""));
    if (res.error) {
      const friendly = friendlyError(res.error);
      setRunError(friendly ? `${friendly}\n\n(Chi tiết: ${res.error})` : res.error);
    }
    setRunning(false);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    setResults(null);
    setScore(null);

    try {
      const pyTests: PyTestCase[] = tests.map((t) => ({
        type: t.type,
        input: t.input,
        expectedOutput: t.expectedOutput,
      }));
      const localResults = await gradeAgainstTests(code, pyTests);

      const annotated = localResults.map((r, i) => ({
        ...r,
        testCaseId: tests[i].id,
        hidden: tests[i].hidden,
      }));
      setResults(annotated);

      const durationSeconds = Math.min(
        7200,
        Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)),
      );

      const submitPayload = {
        exerciseId,
        code,
        durationSeconds,
        results: annotated.map((r) => ({
          testCaseId: r.testCaseId,
          passed: r.passed,
          stdout: r.stdout,
          stderr: r.stderr,
          error: r.error,
          expected: r.expected,
          hidden: r.hidden,
        })),
      };

      const res = await submitExercise(submitPayload);
      if (res.error) {
        setSubmitError(res.error);
      } else {
        const weights = tests.reduce((s, t) => s + t.weight, 0) || 1;
        const earned = annotated.reduce(
          (s, r, i) => s + (r.passed ? tests[i].weight : 0),
          0,
        );
        setScore(Math.round((earned / weights) * 100));
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const allPassed = results !== null && passedCount === results.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-sm text-zinc-500">
          <Link
            href={`/student/classes/${classId}`}
            className="hover:underline"
          >
            ← {className}
          </Link>
        </div>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
          <h1 className={`font-bold ${isCap1 ? "text-4xl" : "text-3xl"}`}>
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                isCap1
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {isCap1 ? "Cấp 1" : "Cấp 2"}
            </span>
            {bestScore !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  bestScore === 100
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                Điểm cao nhất: {bestScore}/100
              </span>
            )}
            <Link
              href={`/student/exercises/${exerciseId}/history`}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              📜 Lịch sử nộp
            </Link>
            <span
              className={
                pyReady ? "text-emerald-600" : "text-zinc-400"
              }
            >
              {pyReady ? "● Python sẵn sàng" : "● Đang tải Python..."}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Đề bài</CardTitle>
          </CardHeader>
          <CardContent>
            <pre
              className={`whitespace-pre-wrap font-sans leading-relaxed ${
                isCap1 ? "text-base" : "text-sm"
              } text-zinc-700 dark:text-zinc-300`}
            >
              {description}
            </pre>
            {tests.filter((t) => !t.hidden).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold">Ví dụ test:</h3>
                <div className="mt-2 flex flex-col gap-2">
                  {tests
                    .filter((t) => !t.hidden)
                    .map((t, idx) => (
                      <div
                        key={t.id}
                        className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900"
                      >
                        <div className="text-zinc-500">
                          Test #{idx + 1} (
                          {t.type === "stdin_stdout"
                            ? "stdin/stdout"
                            : t.type === "function_check"
                              ? "assert"
                              : "custom"}
                          )
                        </div>
                        {t.input && (
                          <>
                            <div className="mt-1 text-zinc-500">Input:</div>
                            <pre className="whitespace-pre-wrap">{t.input}</pre>
                          </>
                        )}
                        {t.expectedOutput && (
                          <>
                            <div className="mt-1 text-zinc-500">Output:</div>
                            <pre className="whitespace-pre-wrap">
                              {t.expectedOutput}
                            </pre>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {tests.some((t) => t.hidden) && (
              <p className="mt-3 text-xs text-zinc-400">
                ⚠️ Có {tests.filter((t) => t.hidden).length} test ẩn nữa — bạn
                sẽ biết kết quả khi nộp bài.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Code Python của bạn</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRun}
                  disabled={!pyReady || running || submitting}
                >
                  {running ? "..." : "▶ Chạy thử"}
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={handleSubmit}
                  disabled={!pyReady || submitting || running}
                >
                  {submitting ? "Đang chấm..." : "📤 Nộp bài"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className={isCap1 ? "h-80" : "h-96"}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  fontSize={isCap1 ? 16 : 14}
                />
              </div>
            </CardContent>
          </Card>

          {!results && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chạy thử</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-zinc-500">
                    Dữ liệu nhập cho `input()` (mỗi dòng 1 input)
                  </label>
                  <Textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    rows={3}
                    className="font-mono text-xs"
                    placeholder="Để trống nếu không dùng input()"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Kết quả</label>
                  <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
                    {runOutput || (running ? "..." : "Nhấn ▶ Chạy thử")}
                  </pre>
                  {runError && (
                    <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {runError}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {results && (
            <Card
              className={
                allPassed
                  ? "border-emerald-500 dark:border-emerald-700"
                  : "border-amber-500 dark:border-amber-700"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {allPassed ? "🎉 Hoàn hảo!" : "Kết quả nộp bài"}
                  {score !== null && (
                    <span
                      className={`ml-auto text-lg ${allPassed ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {score}/100
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-zinc-500">
                  Đã pass {passedCount}/{results.length} test cases
                </p>
                {submitError && (
                  <p className="text-sm text-rose-600">{submitError}</p>
                )}
                <ul className="flex flex-col gap-2">
                  {results.map((r, i) => (
                    <li
                      key={i}
                      className={`rounded-lg border p-3 text-xs ${
                        r.passed
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
                          : "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40"
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>
                          {r.passed ? "✅" : "❌"} Test #{i + 1}
                          {r.hidden && (
                            <span className="ml-2 text-zinc-500">(ẩn)</span>
                          )}
                        </span>
                      </div>
                      {!r.passed && !r.hidden && (
                        <div className="mt-2 grid gap-2 font-mono">
                          {r.error && (
                            <div className="text-rose-700 dark:text-rose-300">
                              {friendlyError(r.error) ?? r.error}
                            </div>
                          )}
                          {!r.error && r.expected !== "assertions pass" && (
                            <>
                              <div>
                                <span className="text-zinc-500">
                                  Mong đợi:
                                </span>
                                <pre className="whitespace-pre-wrap">
                                  {r.expected}
                                </pre>
                              </div>
                              <div>
                                <span className="text-zinc-500">
                                  Bạn in ra:
                                </span>
                                <pre className="whitespace-pre-wrap">
                                  {r.stdout || "(rỗng)"}
                                </pre>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setResults(null);
                    setScore(null);
                  }}
                  className="mt-2 self-start"
                >
                  ↩ Quay lại sửa code
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
