import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const isTeacher = user.role === "teacher";

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              🐍 PyKids
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              {isTeacher ? (
                <Link
                  href="/teacher/classes"
                  className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Lớp của tôi
                </Link>
              ) : (
                <>
                  <Link
                    href="/student/classes"
                    className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Lớp đã tham gia
                  </Link>
                  <Link
                    href="/student/join"
                    className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Tham gia lớp
                  </Link>
                </>
              )}
              <Link
                href="/playground"
                className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Playground
              </Link>
              <Link
                href={
                  isTeacher ? "/docs/giao-vien" : "/docs/hoc-sinh"
                }
                className="rounded-md px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Hướng dẫn
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/profile"
              className="text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
              title="Chỉnh sửa thông tin tài khoản"
            >
              {user.name} · {isTeacher ? "Giáo viên" : "Học sinh"}
            </Link>
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
