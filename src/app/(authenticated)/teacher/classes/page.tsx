import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes } from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function TeacherClassesPage() {
  const user = await requireTeacher();

  const myClasses = await db
    .select()
    .from(classes)
    .where(eq(classes.teacherId, user.id))
    .orderBy(desc(classes.createdAt));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lớp của tôi</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Tạo lớp, sinh mã mời, và ra bài tập Python cho học sinh.
          </p>
        </div>
        <Link href="/teacher/classes/new">
          <Button>+ Tạo lớp mới</Button>
        </Link>
      </div>

      {myClasses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="text-5xl">🎓</div>
            <p className="text-lg font-medium">Chưa có lớp nào</p>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Tạo lớp đầu tiên để bắt đầu ra bài tập Python cho học sinh.
            </p>
            <Link href="/teacher/classes/new">
              <Button>+ Tạo lớp đầu tiên</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((cls) => (
            <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
              <Card className="h-full transition-colors hover:border-indigo-500">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{cls.name}</h2>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Lớp {cls.gradeLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Mã lớp:</span>
                    <code className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {cls.code}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
