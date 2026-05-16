import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, classMembers } from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";
import { Leaderboard } from "@/components/leaderboard";
import { computeLeaderboard } from "@/lib/leaderboard";

export default async function StudentLeaderboardPage({
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

  const { rows, totalExercises } = await computeLeaderboard(id);

  return (
    <Leaderboard
      rows={rows}
      totalExercises={totalExercises}
      className={cls.name}
      highlightStudentId={user.id}
      backHref={`/student/classes/${cls.id}`}
      backLabel={cls.name}
    />
  );
}
