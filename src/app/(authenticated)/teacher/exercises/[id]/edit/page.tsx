import { notFound } from "next/navigation";
import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, exercises, testCases } from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { deleteExercise } from "@/lib/actions/exercises";
import { ExerciseEditor } from "@/components/exercise-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditExercisePage({
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

  const dbTests = await db
    .select()
    .from(testCases)
    .where(eq(testCases.exerciseId, ex.id))
    .orderBy(asc(testCases.orderIndex));

  return (
    <div className="flex flex-col gap-6">
      <ExerciseEditor
        classId={cls.id}
        className={cls.name}
        classGradeLevel={cls.gradeLevel}
        exerciseId={ex.id}
        initial={{
          title: ex.title,
          description: ex.description,
          difficulty: ex.difficulty,
          starterCode: ex.starterCode,
          solutionCode: ex.solutionCode,
          tests: dbTests.map((t) => ({
            localId: t.id,
            type: t.type,
            input: t.input,
            expectedOutput: t.expectedOutput,
            hidden: t.hidden,
            weight: t.weight,
          })),
        }}
      />

      <Card>
        <CardContent className="flex items-center justify-between gap-3 p-6">
          <div>
            <p className="text-sm font-medium">Xóa bài tập này</p>
            <p className="text-xs text-zinc-500">
              Tất cả test cases và lịch sử nộp bài sẽ bị xóa.
            </p>
          </div>
          <form action={deleteExercise}>
            <input type="hidden" name="exerciseId" value={ex.id} />
            <Button type="submit" variant="danger" size="sm">
              Xóa bài tập
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-zinc-400">
        <Link
          href={`/teacher/classes/${cls.id}`}
          className="hover:underline"
        >
          ← Quay lại lớp
        </Link>
      </p>
    </div>
  );
}
