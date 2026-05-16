import { notFound } from "next/navigation";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  classes,
  classMembers,
  exercises,
  submissions,
  testCases,
} from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";
import { ExerciseSolver } from "@/components/exercise-solver";

export default async function SolveExercisePage({
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

  const tests = await db
    .select()
    .from(testCases)
    .where(eq(testCases.exerciseId, ex.id))
    .orderBy(asc(testCases.orderIndex));

  const [latestSubmission] = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.exerciseId, ex.id),
        eq(submissions.studentId, user.id),
      ),
    )
    .orderBy(desc(submissions.submittedAt))
    .limit(1);

  const allMine = await db
    .select({ score: submissions.score })
    .from(submissions)
    .where(
      and(
        eq(submissions.exerciseId, ex.id),
        eq(submissions.studentId, user.id),
      ),
    );
  const bestScore =
    allMine.length > 0
      ? Math.max(...allMine.map((s) => s.score))
      : undefined;

  return (
    <ExerciseSolver
      classId={cls.id}
      className={cls.name}
      exerciseId={ex.id}
      title={ex.title}
      description={ex.description}
      difficulty={ex.difficulty}
      starterCode={ex.starterCode}
      initialCode={latestSubmission?.code}
      bestScore={bestScore}
      tests={tests.map((t) => ({
        id: t.id,
        type: t.type,
        input: t.input,
        expectedOutput: t.expectedOutput,
        hidden: t.hidden,
        weight: t.weight,
      }))}
    />
  );
}
