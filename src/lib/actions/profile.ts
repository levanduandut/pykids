"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-helpers";

const schema = z.object({
  fullName: z.string().min(2, "Họ tên cần ít nhất 2 ký tự").max(80),
  gradeLevel: z
    .number()
    .int()
    .min(1)
    .max(9)
    .nullable()
    .optional(),
});

export type UpdateProfileState = { error?: string; ok?: boolean };

export async function updateProfile(
  _prev: UpdateProfileState | undefined,
  formData: FormData,
): Promise<UpdateProfileState> {
  const user = await requireUser();

  const rawGrade = formData.get("gradeLevel");
  const gradeLevel =
    user.role === "student" && rawGrade ? Number(rawGrade) : null;

  const parsed = schema.safeParse({
    fullName: String(formData.get("fullName") ?? "").trim(),
    gradeLevel: user.role === "student" ? gradeLevel : null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  await db
    .update(users)
    .set({
      fullName: parsed.data.fullName,
      gradeLevel: parsed.data.gradeLevel ?? null,
    })
    .where(eq(users.id, user.id));

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
