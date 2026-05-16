import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  classes,
  exercises,
  classMembers,
  users,
} from "@/lib/db/schema";
import { requireTeacher } from "@/lib/auth-helpers";
import { deleteClass, removeStudent } from "@/lib/actions/classes";
import { deleteAllSubmissionsForStudent } from "@/lib/actions/submissions";
import { seedCurriculum } from "@/lib/actions/curriculum";
import { CURRICULUM_EXERCISES } from "@/lib/curriculum/exercises";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireTeacher();

  const cls = await db.query.classes.findFirst({
    where: and(eq(classes.id, id), eq(classes.teacherId, user.id)),
  });
  if (!cls) notFound();

  const [classExercises, studentRows] = await Promise.all([
    db
      .select()
      .from(exercises)
      .where(eq(exercises.classId, id))
      .orderBy(desc(exercises.createdAt)),
    db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        gradeLevel: users.gradeLevel,
        joinedAt: classMembers.joinedAt,
      })
      .from(classMembers)
      .innerJoin(users, eq(users.id, classMembers.studentId))
      .where(eq(classMembers.classId, id))
      .orderBy(desc(classMembers.joinedAt)),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-500">
            <Link href="/teacher/classes" className="hover:underline">
              ← Lớp của tôi
            </Link>
          </div>
          <h1 className="mt-1 text-3xl font-bold">{cls.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Lớp {cls.gradeLevel}
            </span>
            <span className="text-zinc-500">Mã mời:</span>
            <code className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-base font-semibold dark:bg-zinc-800">
              {cls.code}
            </code>
            <span className="text-xs text-zinc-400">
              (Học sinh dùng mã này để tham gia)
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/teacher/classes/${cls.id}/leaderboard`}>
            <Button variant="outline">🏆 Xếp hạng</Button>
          </Link>
          <Link href={`/teacher/classes/${cls.id}/progress`}>
            <Button variant="outline">📊 Tiến độ</Button>
          </Link>
          <Link href={`/teacher/classes/${cls.id}/exercises/new`}>
            <Button>+ Tạo bài tập</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Bài tập ({classExercises.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {classExercises.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-zinc-500">
                  <span className="text-4xl">📝</span>
                  <p>Chưa có bài tập nào</p>
                  <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <Link
                      href={`/teacher/classes/${cls.id}/exercises/new`}
                    >
                      <Button variant="outline" size="sm">
                        Tạo bài đầu tiên
                      </Button>
                    </Link>
                    <span className="text-xs text-zinc-400">hoặc</span>
                    <form action={seedCurriculum}>
                      <input
                        type="hidden"
                        name="classId"
                        value={cls.id}
                      />
                      <Button type="submit" size="sm">
                        📚 Tải bộ bài mẫu ({CURRICULUM_EXERCISES.length} bài)
                      </Button>
                    </form>
                  </div>
                  <p className="mt-1 max-w-md text-xs text-zinc-400">
                    Bộ bài mẫu theo giáo trình Python 24 buổi cho cấp 2 — từ Hello World tới hàm, OOP cơ bản.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {classExercises.map((ex) => (
                    <li
                      key={ex.id}
                      className="flex items-center justify-between gap-3 px-6 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <Link
                        href={`/teacher/exercises/${ex.id}/edit`}
                        className="flex flex-1 items-center gap-3"
                      >
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            ex.difficulty === "cap1"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {ex.difficulty === "cap1" ? "Cấp 1" : "Cấp 2"}
                        </span>
                        <span className="font-medium">{ex.title}</span>
                      </Link>
                      <div className="flex items-center gap-2 text-xs">
                        <Link
                          href={`/teacher/exercises/${ex.id}/submissions`}
                          className="rounded px-2 py-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                        >
                          Lịch sử nộp
                        </Link>
                        <Link
                          href={`/teacher/exercises/${ex.id}/edit`}
                          className="text-zinc-400"
                        >
                          Sửa →
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Học sinh ({studentRows.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {studentRows.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-zinc-500">
                  Chưa có học sinh nào tham gia
                </p>
              ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {studentRows.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 px-6 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {s.fullName}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {s.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <form action={deleteAllSubmissionsForStudent}>
                          <input
                            type="hidden"
                            name="classId"
                            value={cls.id}
                          />
                          <input
                            type="hidden"
                            name="studentId"
                            value={s.id}
                          />
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="text-xs text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950"
                            title="Xóa toàn bộ lịch sử nộp bài của học sinh này trong lớp"
                          >
                            Xóa lịch sử
                          </Button>
                        </form>
                        <form action={removeStudent}>
                          <input
                            type="hidden"
                            name="classId"
                            value={cls.id}
                          />
                          <input
                            type="hidden"
                            name="studentId"
                            value={s.id}
                          />
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950"
                          >
                            Rời lớp
                          </Button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <form action={deleteClass}>
                <input type="hidden" name="classId" value={cls.id} />
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  className="w-full"
                >
                  Xóa lớp này
                </Button>
              </form>
              <p className="mt-2 text-xs text-zinc-400">
                Tất cả bài tập và lịch sử nộp bài sẽ bị xóa theo.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
