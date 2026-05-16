import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  classes,
  classMembers,
  exercises,
  submissions,
  users,
} from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";
import { leaveClass } from "@/lib/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireStudent();

  const member = await db.query.classMembers.findFirst({
    where: and(
      eq(classMembers.classId, id),
      eq(classMembers.studentId, user.id),
    ),
  });
  if (!member) notFound();

  const cls = await db.query.classes.findFirst({
    where: eq(classes.id, id),
  });
  if (!cls) notFound();

  const teacher = await db.query.users.findFirst({
    where: eq(users.id, cls.teacherId),
  });

  const classExercises = await db
    .select()
    .from(exercises)
    .where(eq(exercises.classId, id))
    .orderBy(desc(exercises.createdAt));

  const exerciseIds = classExercises.map((e) => e.id);

  let mySubmissions: { exerciseId: string; score: number }[] = [];
  if (exerciseIds.length > 0) {
    const rows = await db
      .select({
        exerciseId: submissions.exerciseId,
        score: submissions.score,
        submittedAt: submissions.submittedAt,
      })
      .from(submissions)
      .where(
        and(
          eq(submissions.studentId, user.id),
          inArray(submissions.exerciseId, exerciseIds),
        ),
      )
      .orderBy(desc(submissions.submittedAt));

    const seen = new Set<string>();
    for (const r of rows) {
      if (seen.has(r.exerciseId)) continue;
      seen.add(r.exerciseId);
      mySubmissions.push({ exerciseId: r.exerciseId, score: r.score });
    }
  }
  const bestByExercise = new Map<string, number>();
  for (const s of mySubmissions) {
    const cur = bestByExercise.get(s.exerciseId) ?? -1;
    if (s.score > cur) bestByExercise.set(s.exerciseId, s.score);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-sm text-zinc-500">
          <Link href="/student/classes" className="hover:underline">
            ← Lớp đã tham gia
          </Link>
        </div>
        <div className="mt-1 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{cls.name}</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Giáo viên: {teacher?.fullName ?? "—"} · Lớp {cls.gradeLevel}
            </p>
          </div>
          <form action={leaveClass}>
            <input type="hidden" name="classId" value={cls.id} />
            <Button type="submit" variant="ghost" size="sm">
              Rời lớp
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Bài tập ({classExercises.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {classExercises.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-zinc-500">
              Giáo viên chưa giao bài tập nào.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {classExercises.map((ex) => {
                const bestScore = bestByExercise.get(ex.id);
                const done = bestScore !== undefined;
                return (
                  <li key={ex.id}>
                    <Link
                      href={`/student/exercises/${ex.id}`}
                      className="flex items-center justify-between gap-3 px-6 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            ex.difficulty === "cap1"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {ex.difficulty === "cap1" ? "Cấp 1" : "Cấp 2"}
                        </span>
                        <span className="font-medium">{ex.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        {done ? (
                          <span
                            className={
                              bestScore === 100
                                ? "font-semibold text-emerald-600"
                                : "font-semibold text-amber-600"
                            }
                          >
                            {bestScore}/100
                          </span>
                        ) : (
                          <span className="text-zinc-400">Chưa làm</span>
                        )}
                        <span className="text-xs text-zinc-400">→</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
