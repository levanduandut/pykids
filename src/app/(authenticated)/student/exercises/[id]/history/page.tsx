import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  classes,
  classMembers,
  exercises,
  submissions,
} from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";
import { SubmissionHistory } from "@/components/submission-history";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default async function StudentHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireStudent();

  const ex = await db.query.exercises.findFirst({
    where: eq(exercises.id, id),
  });
  if (!ex) notFound();

  const member = await db.query.classMembers.findFirst({
    where: and(
      eq(classMembers.classId, ex.classId),
      eq(classMembers.studentId, user.id),
    ),
  });
  if (!member) notFound();

  const cls = await db.query.classes.findFirst({
    where: eq(classes.id, ex.classId),
  });
  if (!cls) notFound();

  const mySubs = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.exerciseId, ex.id),
        eq(submissions.studentId, user.id),
      ),
    )
    .orderBy(desc(submissions.submittedAt));

  const totalSeconds = mySubs.reduce((s, x) => s + x.durationSeconds, 0);
  const best = mySubs.length > 0 ? Math.max(...mySubs.map((s) => s.score)) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-sm text-zinc-500">
          <Link
            href={`/student/exercises/${ex.id}`}
            className="hover:underline"
          >
            ← Quay lại bài tập
          </Link>
        </div>
        <h1 className="mt-1 text-3xl font-bold">Lịch sử nộp bài</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {ex.title} · Lớp {cls.name}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Số lần nộp</p>
            <p className="mt-1 text-2xl font-bold">{mySubs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Điểm cao nhất</p>
            <p className="mt-1 text-2xl font-bold">
              {best !== null ? `${best}/100` : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Tổng thời gian làm bài</p>
            <p className="mt-1 text-2xl font-bold">
              {formatDuration(totalSeconds)}
            </p>
          </CardContent>
        </Card>
      </div>

      <SubmissionHistory
        submissions={mySubs.map((s) => ({
          id: s.id,
          score: s.score,
          passedCount: s.passedCount,
          totalCount: s.totalCount,
          durationSeconds: s.durationSeconds,
          submittedAt: s.submittedAt.toISOString(),
          code: s.code,
        }))}
        emptyText="Bạn chưa nộp bài lần nào. Quay lại làm bài nhé!"
      />
    </div>
  );
}
