"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatRelativeTime } from "@/lib/utils";
import { deleteSubmission } from "@/lib/actions/submissions";

export type SubmissionRow = {
  id: string;
  studentName?: string;
  score: number;
  passedCount: number;
  totalCount: number;
  durationSeconds: number;
  submittedAt: string; // ISO string
  code: string;
};

type Props = {
  submissions: SubmissionRow[];
  showStudent?: boolean;
  canDelete?: boolean;
  emptyText?: string;
};

export function SubmissionHistory({
  submissions,
  showStudent = false,
  canDelete = false,
  emptyText = "Chưa có lần nộp nào.",
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-zinc-500">
          {emptyText}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {submissions.map((s) => {
        const open = openId === s.id;
        const submittedAt = new Date(s.submittedAt);
        return (
          <Card key={s.id}>
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${
                      s.score === 100
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : s.score >= 50
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {s.score}/100
                  </span>
                  {showStudent && s.studentName && (
                    <span className="font-medium">{s.studentName}</span>
                  )}
                  <span className="text-xs text-zinc-500">
                    {s.passedCount}/{s.totalCount} test pass
                  </span>
                  <span className="text-xs text-zinc-500">
                    ⏱ {formatDuration(s.durationSeconds)}
                  </span>
                  <span
                    className="text-xs text-zinc-500"
                    title={submittedAt.toLocaleString("vi-VN")}
                  >
                    {formatRelativeTime(submittedAt)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOpenId(open ? null : s.id)}
                  >
                    {open ? "Ẩn code" : "Xem code"}
                  </Button>
                  {canDelete && (
                    <form action={deleteSubmission}>
                      <input
                        type="hidden"
                        name="submissionId"
                        value={s.id}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950"
                      >
                        Xóa
                      </Button>
                    </form>
                  )}
                </div>
              </div>
              {open && (
                <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
                  {s.code}
                </pre>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
