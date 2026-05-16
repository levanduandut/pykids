"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  classMembers,
  classes,
  exercises,
  submissions,
  testCases,
} from "@/lib/db/schema";
import { requireStudent, requireTeacher } from "@/lib/auth-helpers";

const resultSchema = z.object({
  testCaseId: z.string().uuid(),
  passed: z.boolean(),
  stdout: z.string(),
  stderr: z.string(),
  error: z.string().nullable(),
  expected: z.string(),
  hidden: z.boolean(),
});

const submitSchema = z.object({
  exerciseId: z.string().uuid(),
  code: z.string(),
  results: z.array(resultSchema),
  durationSeconds: z.number().int().min(0).max(7200),
});

export type SubmitPayload = z.infer<typeof submitSchema>;

export type SubmitResponse = {
  ok?: true;
  submissionId?: string;
  error?: string;
};

export async function submitExercise(
  payload: SubmitPayload,
): Promise<SubmitResponse> {
  const user = await requireStudent();
  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const ex = await db.query.exercises.findFirst({
    where: eq(exercises.id, parsed.data.exerciseId),
  });
  if (!ex) return { error: "Không tìm thấy bài tập" };

  const member = await db.query.classMembers.findFirst({
    where: and(
      eq(classMembers.classId, ex.classId),
      eq(classMembers.studentId, user.id),
    ),
  });
  if (!member) return { error: "Bạn không thuộc lớp này" };

  const tests = await db
    .select()
    .from(testCases)
    .where(eq(testCases.exerciseId, parsed.data.exerciseId));

  const weightById = new Map(tests.map((t) => [t.id, t.weight]));
  const totalWeight = tests.reduce((s, t) => s + t.weight, 0) || 1;

  let earned = 0;
  let passedCount = 0;
  for (const r of parsed.data.results) {
    if (!weightById.has(r.testCaseId)) continue;
    if (r.passed) {
      passedCount += 1;
      earned += weightById.get(r.testCaseId) ?? 0;
    }
  }
  const score = Math.round((earned / totalWeight) * 100);

  const [created] = await db
    .insert(submissions)
    .values({
      exerciseId: parsed.data.exerciseId,
      studentId: user.id,
      code: parsed.data.code,
      score,
      passedCount,
      totalCount: tests.length,
      results: parsed.data.results,
      durationSeconds: parsed.data.durationSeconds,
    })
    .returning({ id: submissions.id });

  revalidatePath(`/student/classes/${ex.classId}`);
  revalidatePath(`/student/exercises/${ex.id}`);
  revalidatePath(`/student/exercises/${ex.id}/history`);
  revalidatePath(`/teacher/classes/${ex.classId}/progress`);
  revalidatePath(`/teacher/classes/${ex.classId}/leaderboard`);
  return { ok: true, submissionId: created.id };
}

export async function deleteSubmission(formData: FormData) {
  const user = await requireTeacher();
  const submissionId = String(formData.get("submissionId") ?? "");
  if (!submissionId) return;

  const sub = await db.query.submissions.findFirst({
    where: eq(submissions.id, submissionId),
  });
  if (!sub) return;

  const ex = await db.query.exercises.findFirst({
    where: eq(exercises.id, sub.exerciseId),
  });
  if (!ex) return;

  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, ex.classId), eq(classes.teacherId, user.id)),
  });
  if (!cls) return;

  await db.delete(submissions).where(eq(submissions.id, submissionId));

  revalidatePath(`/teacher/exercises/${ex.id}/submissions`);
  revalidatePath(`/teacher/classes/${ex.classId}/progress`);
  revalidatePath(`/teacher/classes/${ex.classId}/leaderboard`);
}

export async function deleteAllSubmissionsForStudent(formData: FormData) {
  const user = await requireTeacher();
  const classId = String(formData.get("classId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  if (!classId || !studentId) return;

  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, user.id)),
  });
  if (!cls) return;

  const classExercises = await db
    .select({ id: exercises.id })
    .from(exercises)
    .where(eq(exercises.classId, classId));

  for (const ex of classExercises) {
    await db
      .delete(submissions)
      .where(
        and(
          eq(submissions.exerciseId, ex.id),
          eq(submissions.studentId, studentId),
        ),
      );
  }

  revalidatePath(`/teacher/classes/${classId}/progress`);
  revalidatePath(`/teacher/classes/${classId}/leaderboard`);
}
