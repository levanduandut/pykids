"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createExercise,
  updateExercise,
  type ExercisePayload,
} from "@/lib/actions/exercises";
import { gradeAgainstTests, type TestCase } from "@/lib/pyodide/runner";

type Difficulty = "cap1" | "cap2";
type TestType = "stdin_stdout" | "function_check" | "custom_script";

type EditorTest = {
  localId: string;
  type: TestType;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  weight: number;
};

type Props = {
  classId: string;
  className: string;
  classGradeLevel: number;
  exerciseId?: string;
  initial?: {
    title: string;
    description: string;
    difficulty: Difficulty;
    starterCode: string;
    solutionCode: string;
    tests: EditorTest[];
  };
};

const TEMPLATE_STDIN: EditorTest = {
  localId: "",
  type: "stdin_stdout",
  input: "",
  expectedOutput: "",
  hidden: false,
  weight: 1,
};

const TEMPLATE_FUNCTION: EditorTest = {
  localId: "",
  type: "function_check",
  input: "assert tinh_tong(2, 3) == 5",
  expectedOutput: "",
  hidden: false,
  weight: 1,
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ExerciseEditor({
  classId,
  className,
  classGradeLevel,
  exerciseId,
  initial,
}: Props) {
  const router = useRouter();
  const isEdit = !!exerciseId;

  const defaultDifficulty: Difficulty = classGradeLevel <= 5 ? "cap1" : "cap2";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initial?.difficulty ?? defaultDifficulty,
  );
  const [starterCode, setStarterCode] = useState(
    initial?.starterCode ?? "# Học sinh viết code ở đây\n",
  );
  const [solutionCode, setSolutionCode] = useState(
    initial?.solutionCode ?? "# Đáp án của giáo viên (ẩn với học sinh)\n",
  );
  const [tests, setTests] = useState<EditorTest[]>(
    initial?.tests ?? [{ ...TEMPLATE_STDIN, localId: uid() }],
  );

  const [error, setError] = useState<string | null>(null);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [pending, startTransition] = useTransition();

  function updateTest(localId: string, patch: Partial<EditorTest>) {
    setTests((curr) =>
      curr.map((t) => (t.localId === localId ? { ...t, ...patch } : t)),
    );
  }

  function addTest(template: EditorTest) {
    setTests((curr) => [...curr, { ...template, localId: uid() }]);
  }

  function removeTest(localId: string) {
    setTests((curr) => curr.filter((t) => t.localId !== localId));
  }

  function moveTest(localId: string, dir: -1 | 1) {
    setTests((curr) => {
      const idx = curr.findIndex((t) => t.localId === localId);
      if (idx < 0) return curr;
      const target = idx + dir;
      if (target < 0 || target >= curr.length) return curr;
      const next = [...curr];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function handleVerify() {
    setVerifyMsg(null);
    setVerifying(true);
    try {
      const pyTests: TestCase[] = tests.map((t) => ({
        type: t.type,
        input: t.input,
        expectedOutput: t.expectedOutput,
      }));
      const results = await gradeAgainstTests(solutionCode, pyTests);
      const passed = results.filter((r) => r.passed).length;
      const total = results.length;
      if (passed === total) {
        setVerifyMsg(`✅ Đáp án vượt qua ${passed}/${total} test cases.`);
      } else {
        const firstFail = results.findIndex((r) => !r.passed);
        const failResult = results[firstFail];
        setVerifyMsg(
          `❌ Đáp án chỉ qua ${passed}/${total}. Test #${firstFail + 1} fail` +
            (failResult.error
              ? ` — lỗi: ${failResult.error}`
              : `\n  Mong đợi: ${JSON.stringify(failResult.expected)}\n  Thực tế: ${JSON.stringify(failResult.stdout)}`),
        );
      }
    } catch (e) {
      setVerifyMsg(`Lỗi chạy thử: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setVerifying(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }
    if (!description.trim()) {
      setError("Vui lòng nhập mô tả");
      return;
    }
    if (tests.length === 0) {
      setError("Cần ít nhất 1 test case");
      return;
    }

    const payload: ExercisePayload = {
      classId,
      title: title.trim(),
      description,
      difficulty,
      starterCode,
      solutionCode,
      tests: tests.map((t) => ({
        type: t.type,
        input: t.input,
        expectedOutput: t.expectedOutput,
        hidden: t.hidden,
        weight: t.weight,
      })),
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateExercise({ ...payload, exerciseId: exerciseId! })
        : await createExercise(payload);
      if (res && "error" in res && res.error) {
        setError(res.error);
        return;
      }
      router.push(`/teacher/classes/${classId}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <div className="text-sm text-zinc-500">
          <Link
            href={`/teacher/classes/${classId}`}
            className="hover:underline"
          >
            ← {className}
          </Link>
        </div>
        <h1 className="mt-1 text-3xl font-bold">
          {isEdit ? "Sửa bài tập" : "Tạo bài tập mới"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Tính tổng hai số"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Mô tả (hỗ trợ Markdown đơn giản)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder={`Ví dụ:\nViết hàm \`tinh_tong(a, b)\` trả về tổng hai số nguyên a, b.\n\n**Input:** 2 số nguyên.\n**Output:** Tổng của 2 số.`}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="difficulty">Cấp độ</Label>
            <Select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              <option value="cap1">Cấp 1 (lớp 1-5) — đơn giản</option>
              <option value="cap2">Cấp 2 (lớp 6-9) — có vòng lặp, hàm</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Code mẫu (cho học sinh)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              <CodeEditor value={starterCode} onChange={setStarterCode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Đáp án (ẩn với học sinh) 🔒
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64">
              <CodeEditor value={solutionCode} onChange={setSolutionCode} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">
            Test cases ({tests.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTest(TEMPLATE_STDIN)}
            >
              + stdin/stdout
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTest(TEMPLATE_FUNCTION)}
            >
              + assert
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {tests.map((t, idx) => (
            <div
              key={t.localId}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Test #{idx + 1}</span>
                <Select
                  value={t.type}
                  onChange={(e) =>
                    updateTest(t.localId, { type: e.target.value as TestType })
                  }
                  className="h-8 w-auto px-2 text-xs"
                >
                  <option value="stdin_stdout">stdin / stdout</option>
                  <option value="function_check">assert</option>
                  <option value="custom_script">custom script</option>
                </Select>
                <label className="ml-2 flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={t.hidden}
                    onChange={(e) =>
                      updateTest(t.localId, { hidden: e.target.checked })
                    }
                  />
                  Ẩn với học sinh
                </label>
                <label className="flex items-center gap-1 text-xs">
                  Điểm
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={t.weight}
                    onChange={(e) =>
                      updateTest(t.localId, {
                        weight: Math.max(1, Number(e.target.value)),
                      })
                    }
                    className="h-7 w-14 rounded border border-zinc-300 px-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </label>
                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveTest(t.localId, -1)}
                    className="rounded p-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTest(t.localId, 1)}
                    className="rounded p-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTest(t.localId)}
                    className="rounded p-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">
                    {t.type === "stdin_stdout"
                      ? "Input (stdin, mỗi dòng = 1 input())"
                      : t.type === "function_check"
                        ? "Code kiểm tra (chèn vào sau code học sinh)"
                        : "Script tùy chỉnh"}
                  </Label>
                  <Textarea
                    value={t.input}
                    onChange={(e) =>
                      updateTest(t.localId, { input: e.target.value })
                    }
                    rows={4}
                    className="font-mono text-xs"
                    placeholder={
                      t.type === "stdin_stdout"
                        ? "5\n10"
                        : t.type === "function_check"
                          ? "assert tinh_tong(2, 3) == 5"
                          : "# code tự do"
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">
                    {t.type === "stdin_stdout"
                      ? "Output mong đợi"
                      : "Output mong đợi (bỏ trống = chỉ cần không lỗi)"}
                  </Label>
                  <Textarea
                    value={t.expectedOutput}
                    onChange={(e) =>
                      updateTest(t.localId, { expectedOutput: e.target.value })
                    }
                    rows={4}
                    className="font-mono text-xs"
                    disabled={t.type === "function_check"}
                    placeholder={
                      t.type === "function_check"
                        ? "(Không dùng cho assert)"
                        : "15"
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? "Đang chạy..." : "▶ Chạy đáp án qua tests"}
            </Button>
            {verifyMsg && (
              <pre className="mt-2 whitespace-pre-wrap text-xs">
                {verifyMsg}
              </pre>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <div className="flex gap-2">
              <Link href={`/teacher/classes/${classId}`}>
                <Button variant="ghost" type="button">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={pending}>
                {pending
                  ? "Đang lưu..."
                  : isEdit
                    ? "Lưu thay đổi"
                    : "Tạo bài tập"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export type { EditorTest };
