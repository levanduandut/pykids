"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, exercises, testCases } from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { CURRICULUM_EXERCISES } from "@/lib/curriculum/exercises";

export async function seedCurriculum(formData: FormData) {
  const user = await requireTeacher();
  const classId = String(formData.get("classId") ?? "");
  if (!classId) return;

  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, user.id)),
  });
  if (!cls) return;

  for (const item of CURRICULUM_EXERCISES) {
    const [created] = await db
      .insert(exercises)
      .values({
        classId,
        title: item.title,
        description: item.description,
        difficulty: item.difficulty,
        starterCode: item.starterCode,
        solutionCode: item.solutionCode,
      })
      .returning({ id: exercises.id });

    if (item.tests.length > 0) {
      await db.insert(testCases).values(
        item.tests.map((t, idx) => ({
          exerciseId: created.id,
          type: t.type,
          input: t.input,
          expectedOutput: t.expectedOutput,
          hidden: t.hidden,
          weight: t.weight,
          orderIndex: idx,
        })),
      );
    }
  }

  revalidatePath(`/teacher/classes/${classId}`);
  redirect(`/teacher/classes/${classId}`);
}
