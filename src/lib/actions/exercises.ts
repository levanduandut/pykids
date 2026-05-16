"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { classes, exercises, testCases } from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";

const testCaseSchema = z.object({
  type: z.enum(["stdin_stdout", "function_check", "custom_script"]),
  input: z.string(),
  expectedOutput: z.string(),
  hidden: z.boolean(),
  weight: z.number().int().min(1).max(100),
});

const exercisePayloadSchema = z.object({
  classId: z.string().uuid(),
  title: z.string().min(2, "Tiêu đề ít nhất 2 ký tự").max(140),
  description: z.string().min(1, "Phần mô tả không được để trống"),
  difficulty: z.enum(["cap1", "cap2"]),
  starterCode: z.string(),
  solutionCode: z.string(),
  tests: z.array(testCaseSchema).min(1, "Cần ít nhất 1 test case"),
});

const updatePayloadSchema = exercisePayloadSchema.extend({
  exerciseId: z.string().uuid(),
});

export type ExercisePayload = z.infer<typeof exercisePayloadSchema>;
export type UpdateExercisePayload = z.infer<typeof updatePayloadSchema>;

async function ensureTeacherOwnsClass(teacherId: string, classId: string) {
  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, teacherId)),
  });
  return cls;
}

export async function createExercise(payload: ExercisePayload) {
  const user = await requireTeacher();
  const parsed = exercisePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const cls = await ensureTeacherOwnsClass(user.id, parsed.data.classId);
  if (!cls) return { error: "Không tìm thấy lớp" };

  const [created] = await db
    .insert(exercises)
    .values({
      classId: parsed.data.classId,
      title: parsed.data.title.trim(),
      description: parsed.data.description,
      difficulty: parsed.data.difficulty,
      starterCode: parsed.data.starterCode,
      solutionCode: parsed.data.solutionCode,
    })
    .returning({ id: exercises.id });

  if (parsed.data.tests.length > 0) {
    await db.insert(testCases).values(
      parsed.data.tests.map((t, idx) => ({
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

  revalidatePath(`/teacher/classes/${parsed.data.classId}`);
  return { ok: true, exerciseId: created.id };
}

export async function updateExercise(payload: UpdateExercisePayload) {
  const user = await requireTeacher();
  const parsed = updatePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const existing = await db.query.exercises.findFirst({
    where: eq(exercises.id, parsed.data.exerciseId),
  });
  if (!existing) return { error: "Không tìm thấy bài tập" };

  const cls = await ensureTeacherOwnsClass(user.id, existing.classId);
  if (!cls) return { error: "Bạn không có quyền sửa bài này" };

  await db
    .update(exercises)
    .set({
      title: parsed.data.title.trim(),
      description: parsed.data.description,
      difficulty: parsed.data.difficulty,
      starterCode: parsed.data.starterCode,
      solutionCode: parsed.data.solutionCode,
    })
    .where(eq(exercises.id, parsed.data.exerciseId));

  await db
    .delete(testCases)
    .where(eq(testCases.exerciseId, parsed.data.exerciseId));

  if (parsed.data.tests.length > 0) {
    await db.insert(testCases).values(
      parsed.data.tests.map((t, idx) => ({
        exerciseId: parsed.data.exerciseId,
        type: t.type,
        input: t.input,
        expectedOutput: t.expectedOutput,
        hidden: t.hidden,
        weight: t.weight,
        orderIndex: idx,
      })),
    );
  }

  revalidatePath(`/teacher/classes/${existing.classId}`);
  revalidatePath(`/teacher/exercises/${parsed.data.exerciseId}/edit`);
  return { ok: true };
}

export async function deleteExercise(formData: FormData) {
  const user = await requireTeacher();
  const exerciseId = String(formData.get("exerciseId") ?? "");
  if (!exerciseId) return;

  const existing = await db.query.exercises.findFirst({
    where: eq(exercises.id, exerciseId),
  });
  if (!existing) return;

  const cls = await ensureTeacherOwnsClass(user.id, existing.classId);
  if (!cls) return;

  await db.delete(exercises).where(eq(exercises.id, exerciseId));

  revalidatePath(`/teacher/classes/${existing.classId}`);
  redirect(`/teacher/classes/${existing.classId}`);
}
