import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, classMembers, users } from "@/lib/db/schema";
import { requireStudent } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function StudentClassesPage() {
  const user = await requireStudent();

  const joined = await db
    .select({
      id: classes.id,
      name: classes.name,
      code: classes.code,
      gradeLevel: classes.gradeLevel,
      teacherName: users.fullName,
      joinedAt: classMembers.joinedAt,
    })
    .from(classMembers)
    .innerJoin(classes, eq(classes.id, classMembers.classId))
    .innerJoin(users, eq(users.id, classes.teacherId))
    .where(eq(classMembers.studentId, user.id))
    .orderBy(desc(classMembers.joinedAt));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lớp đã tham gia</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Vào lớp để xem bài tập Python và nộp bài.
          </p>
        </div>
        <Link href="/student/join">
          <Button>+ Tham gia lớp</Button>
        </Link>
      </div>

      {joined.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="text-5xl">🎒</div>
            <p className="text-lg font-medium">Chưa tham gia lớp nào</p>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Hỏi giáo viên mã lớp 6 ký tự và bấm "Tham gia lớp" để bắt đầu.
            </p>
            <Link href="/student/join">
              <Button>+ Tham gia lớp</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {joined.map((c) => (
            <Link key={c.id} href={`/student/classes/${c.id}`}>
              <Card className="h-full transition-colors hover:border-indigo-500">
                <CardContent className="flex flex-col gap-2 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{c.name}</h2>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Lớp {c.gradeLevel}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Giáo viên: {c.teacherName}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
