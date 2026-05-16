import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes } from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { Leaderboard } from "@/components/leaderboard";
import { computeLeaderboard } from "@/lib/leaderboard";

export default async function TeacherLeaderboardPage({
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

  const { rows, totalExercises } = await computeLeaderboard(id);

  return (
    <Leaderboard
      rows={rows}
      totalExercises={totalExercises}
      className={cls.name}
      backHref={`/teacher/classes/${cls.id}`}
      backLabel={cls.name}
    />
  );
}
