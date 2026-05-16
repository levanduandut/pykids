import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes } from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { ExerciseEditor } from "@/components/exercise-editor";

export default async function NewExercisePage({
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

  return (
    <ExerciseEditor
      classId={cls.id}
      className={cls.name}
      classGradeLevel={cls.gradeLevel}
    />
  );
}
