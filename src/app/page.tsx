import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            🐍 PyKids
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/playground"
              className="text-sm font-medium text-zinc-700 hover:text-indigo-600 dark:text-zinc-300"
            >
              Thử ngay
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Đăng ký</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Miễn phí · Chạy Python ngay trong trình duyệt
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Học Python vui vẻ cho học sinh{" "}
          <span className="bg-linear-to-r from-indigo-500 to-rose-500 bg-clip-text text-transparent">
            cấp 1 và cấp 2
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Giáo viên ra bài tập và test case. Học sinh viết code, chạy thử, nộp
          bài và nhận kết quả tự động — tất cả trên một trang web.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/playground">
            <Button size="lg">Thử code Python ngay</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              Tạo tài khoản giáo viên
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 text-left dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        Vibe coded với ❤️ — chạy Python bằng Pyodide trong trình duyệt
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "📝",
    title: "Giáo viên ra bài",
    desc: "Viết đề bài, code mẫu, và test case bằng form đơn giản.",
  },
  {
    icon: "✨",
    title: "Chấm tự động",
    desc: "Học sinh nộp bài là biết đúng/sai ngay, không cần chờ.",
  },
  {
    icon: "🔒",
    title: "An toàn",
    desc: "Python chạy ngay trong trình duyệt học sinh — không hại server.",
  },
];
