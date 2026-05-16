"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  classMembers,
  exercises,
  submissions,
  testCases,
} from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";

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
    })
    .returning({ id: submissions.id });

  revalidatePath(`/student/classes/${ex.classId}`);
  revalidatePath(`/student/exercises/${ex.id}`);
  revalidatePath(`/teacher/classes/${ex.classId}/progress`);
  return { ok: true, submissionId: created.id };
}
