"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { classes, classMembers } from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { generateClassCode } from "@/lib/utils";

const createClassSchema = z.object({
  name: z.string().min(2, "Tên lớp cần ít nhất 2 ký tự").max(80),
  gradeLevel: z.number().int().min(1).max(9),
});

export type CreateClassState = { error?: string };

export async function createClass(
  _prevState: CreateClassState | undefined,
  formData: FormData,
): Promise<CreateClassState> {
  const user = await requireTeacher();

  const parsed = createClassSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    gradeLevel: Number(formData.get("gradeLevel")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  let code = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateClassCode(6);
    const existing = await db.query.classes.findFirst({
      where: eq(classes.code, code),
    });
    if (!existing) break;
    if (attempt === 4) {
      return { error: "Không sinh được mã lớp, thử lại nhé" };
    }
  }

  const [created] = await db
    .insert(classes)
    .values({
      teacherId: user.id,
      name: parsed.data.name.trim(),
      code,
      gradeLevel: parsed.data.gradeLevel,
    })
    .returning({ id: classes.id });

  revalidatePath("/teacher/classes");
  redirect(`/teacher/classes/${created.id}`);
}

export async function deleteClass(formData: FormData) {
  const user = await requireTeacher();
  const classId = String(formData.get("classId") ?? "");
  if (!classId) return;

  await db
    .delete(classes)
    .where(and(eq(classes.id, classId), eq(classes.teacherId, user.id)));

  revalidatePath("/teacher/classes");
  redirect("/teacher/classes");
}

export async function removeStudent(formData: FormData) {
  const user = await requireTeacher();
  const classId = String(formData.get("classId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  if (!classId || !studentId) return;

  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.teacherId, user.id)),
  });
  if (!cls) return;

  await db
    .delete(classMembers)
    .where(
      and(
        eq(classMembers.classId, classId),
        eq(classMembers.studentId, studentId),
      ),
    );

  revalidatePath(`/teacher/classes/${classId}`);
}
