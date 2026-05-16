import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const signupSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự"),
  fullName: z.string().min(2, "Họ tên cần ít nhất 2 ký tự"),
  role: z.enum(["teacher", "student"]),
  gradeLevel: z.number().int().min(1).max(9).optional(),
  teacherCode: z.string().optional(),
});

const TEACHER_SIGNUP_CODE = process.env.TEACHER_SIGNUP_CODE ?? "3001";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 },
    );
  }

  const { email, password, fullName, role, gradeLevel, teacherCode } =
    parsed.data;

  if (role === "teacher" && teacherCode !== TEACHER_SIGNUP_CODE) {
    return NextResponse.json(
      { error: "Mã giáo viên không đúng" },
      { status: 403 },
    );
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) {
    return NextResponse.json(
      { error: "Email đã được sử dụng" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    email,
    passwordHash,
    fullName,
    role,
    gradeLevel: gradeLevel ?? null,
  });

  return NextResponse.json({ ok: true });
}
