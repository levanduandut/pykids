import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  classes,
  exercises,
  submissions,
  users,
} from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { SubmissionHistory } from "@/components/submission-history";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default async function TeacherSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireTeacher();

  const ex = await db.query.exercises.findFirst({
    where: eq(exercises.id, id),
  });
  if (!ex) notFound();

  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, ex.classId), eq(classes.teacherId, user.id)),
  });
  if (!cls) notFound();

  const rows = await db
    .select({
      id: submissions.id,
      score: submissions.score,
      passedCount: submissions.passedCount,
      totalCount: submissions.totalCount,
      durationSeconds: submissions.durationSeconds,
      submittedAt: submissions.submittedAt,
      code: submissions.code,
      studentName: users.fullName,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.studentId))
    .where(eq(submissions.exerciseId, ex.id))
    .orderBy(desc(submissions.submittedAt));

  const avgScore =
    rows.length > 0
      ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length)
      : null;
  const totalDuration = rows.reduce((s, r) => s + r.durationSeconds, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-sm text-zinc-500">
          <Link
            href={`/teacher/exercises/${ex.id}/edit`}
            className="hover:underline"
          >
            ← {ex.title}
          </Link>
        </div>
        <h1 className="mt-1 text-3xl font-bold">Lịch sử nộp bài</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Lớp {cls.name} · {ex.title}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Tổng lượt nộp</p>
            <p className="mt-1 text-2xl font-bold">{rows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Điểm trung bình</p>
            <p className="mt-1 text-2xl font-bold">
              {avgScore !== null ? `${avgScore}/100` : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Tổng thời gian làm</p>
            <p className="mt-1 text-2xl font-bold">
              {formatDuration(totalDuration)}
            </p>
          </CardContent>
        </Card>
      </div>

      <SubmissionHistory
        showStudent
        canDelete
        submissions={rows.map((r) => ({
          id: r.id,
          studentName: r.studentName,
          score: r.score,
          passedCount: r.passedCount,
          totalCount: r.totalCount,
          durationSeconds: r.durationSeconds,
          submittedAt: r.submittedAt.toISOString(),
          code: r.code,
        }))}
        emptyText="Chưa có học sinh nào nộp bài này."
      />
    </div>
  );
}
