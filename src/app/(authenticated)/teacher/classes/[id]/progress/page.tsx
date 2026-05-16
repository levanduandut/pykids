import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  classes,
  classMembers,
  exercises,
  submissions,
  users,
} from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireTeacher();

  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, id), eq(classes.teacherId, user.id)),
  });
  if (!cls) notFound();

  const [classExercises, studentRows] = await Promise.all([
    db
      .select()
      .from(exercises)
      .where(eq(exercises.classId, id))
      .orderBy(asc(exercises.createdAt)),
    db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      })
      .from(classMembers)
      .innerJoin(users, eq(users.id, classMembers.studentId))
      .where(eq(classMembers.classId, id))
      .orderBy(users.fullName),
  ]);

  const studentIds = studentRows.map((s) => s.id);
  const exerciseIds = classExercises.map((e) => e.id);

  let subs: {
    exerciseId: string;
    studentId: string;
    score: number;
    submissionId: string;
  }[] = [];
  if (studentIds.length > 0 && exerciseIds.length > 0) {
    const rows = await db
      .select({
        id: submissions.id,
        exerciseId: submissions.exerciseId,
        studentId: submissions.studentId,
        score: submissions.score,
        submittedAt: submissions.submittedAt,
      })
      .from(submissions)
      .where(
        and(
          inArray(submissions.studentId, studentIds),
          inArray(submissions.exerciseId, exerciseIds),
        ),
      )
      .orderBy(desc(submissions.submittedAt));

    const bestKey = new Map<string, { score: number; id: string }>();
    for (const r of rows) {
      const key = `${r.studentId}|${r.exerciseId}`;
      const cur = bestKey.get(key);
      if (!cur || r.score > cur.score) {
        bestKey.set(key, { score: r.score, id: r.id });
      }
    }
    subs = Array.from(bestKey.entries()).map(([key, v]) => {
      const [studentId, exerciseId] = key.split("|");
      return { studentId, exerciseId, score: v.score, submissionId: v.id };
    });
  }

  const scoreLookup = new Map<string, { score: number; submissionId: string }>();
  for (const s of subs) {
    scoreLookup.set(`${s.studentId}|${s.exerciseId}`, {
      score: s.score,
      submissionId: s.submissionId,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-sm text-zinc-500">
          <Link
            href={`/teacher/classes/${cls.id}`}
            className="hover:underline"
          >
            ← {cls.name}
          </Link>
        </div>
        <h1 className="mt-1 text-3xl font-bold">Tiến độ học sinh</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Điểm cao nhất của mỗi học sinh ở mỗi bài tập.
        </p>
      </div>

      {studentRows.length === 0 || classExercises.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-zinc-500">
            {studentRows.length === 0
              ? "Chưa có học sinh nào tham gia lớp."
              : "Chưa có bài tập nào trong lớp."}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {studentRows.length} học sinh × {classExercises.length} bài tập
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-medium dark:bg-zinc-950">
                    Học sinh
                  </th>
                  {classExercises.map((ex) => (
                    <th
                      key={ex.id}
                      className="px-3 py-3 text-center font-medium"
                      title={ex.title}
                    >
                      <Link
                        href={`/teacher/exercises/${ex.id}/edit`}
                        className="hover:underline"
                      >
                        {ex.title.length > 14
                          ? `${ex.title.slice(0, 14)}…`
                          : ex.title}
                      </Link>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center font-medium">TB</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((s) => {
                  const scores = classExercises
                    .map(
                      (ex) =>
                        scoreLookup.get(`${s.id}|${ex.id}`)?.score ?? null,
                    )
                    .filter((s): s is number => s !== null);
                  const avg =
                    scores.length > 0
                      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                      : null;
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="sticky left-0 z-10 bg-white px-4 py-2 dark:bg-zinc-950">
                        <div className="font-medium">{s.fullName}</div>
                        <div className="text-xs text-zinc-500">{s.email}</div>
                      </td>
                      {classExercises.map((ex) => {
                        const cell = scoreLookup.get(`${s.id}|${ex.id}`);
                        return (
                          <td
                            key={ex.id}
                            className="px-3 py-2 text-center"
                          >
                            {cell ? (
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  cell.score === 100
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : cell.score >= 50
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                      : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                }`}
                              >
                                {cell.score}
                              </span>
                            ) : (
                              <span className="text-zinc-300">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 text-center font-semibold">
                        {avg ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
