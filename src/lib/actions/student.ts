"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, classMembers } from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";

export type JoinClassState = { error?: string };

export async function joinClass(
  _prevState: JoinClassState | undefined,
  formData: FormData,
): Promise<JoinClassState> {
  const user = await requireStudent();
  const rawCode = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();

  if (!rawCode || rawCode.length < 4) {
    return { error: "Mã lớp không hợp lệ" };
  }

  const cls = await db.query.classes.findFirst({
    where: eq(classes.code, rawCode),
  });
  if (!cls) {
    return { error: "Không tìm thấy lớp với mã này" };
  }

  const existing = await db.query.classMembers.findFirst({
    where: and(
      eq(classMembers.classId, cls.id),
      eq(classMembers.studentId, user.id),
    ),
  });
  if (existing) {
    redirect(`/student/classes/${cls.id}`);
  }

  await db.insert(classMembers).values({
    classId: cls.id,
    studentId: user.id,
  });

  revalidatePath("/student/classes");
  revalidatePath(`/teacher/classes/${cls.id}`);
  redirect(`/student/classes/${cls.id}`);
}

export async function leaveClass(formData: FormData) {
  const user = await requireStudent();
  const classId = String(formData.get("classId") ?? "");
  if (!classId) return;

  await db
    .delete(classMembers)
    .where(
      and(
        eq(classMembers.classId, classId),
        eq(classMembers.studentId, user.id),
      ),
    );

  revalidatePath("/student/classes");
  redirect("/student/classes");
}
