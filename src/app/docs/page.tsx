import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function DocsIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">📖 Hướng dẫn sử dụng PyKids</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Chọn vai trò của bạn để xem hướng dẫn chi tiết.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/docs/giao-vien">
          <Card className="h-full transition-colors hover:border-indigo-500">
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="text-5xl">👩‍🏫</div>
              <h2 className="text-xl font-semibold">Tôi là giáo viên</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Tạo lớp, ra bài tập Python, theo dõi tiến độ học sinh, chấm tự
                động.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/docs/hoc-sinh">
          <Card className="h-full transition-colors hover:border-indigo-500">
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="text-5xl">🎒</div>
              <h2 className="text-xl font-semibold">Tôi là học sinh</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Tham gia lớp, làm bài Python, nộp bài và xem điểm ngay lập tức.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h3 className="text-lg font-semibold">🐍 PyKids là gì?</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            PyKids là nền tảng web giúp giáo viên ra bài tập Python và học
            sinh cấp 1, 2 làm bài trực tuyến với chấm tự động. Code Python chạy
            ngay trong trình duyệt (bằng Pyodide / WebAssembly), không cần cài
            đặt gì cả.
          </p>
          <ul className="ml-5 list-disc text-sm text-zinc-600 dark:text-zinc-400">
            <li>✅ Hoàn toàn miễn phí</li>
            <li>✅ Không cần cài Python, chạy mọi trình duyệt hiện đại</li>
            <li>✅ An toàn — code chạy trên máy học sinh, không hại server</li>
            <li>
              ✅ Có sẵn 26 bài tập theo giáo trình 24 buổi cho cấp 2 — chỉ cần
              1 click để load vào lớp
            </li>
          </ul>
          <p className="mt-2 text-sm text-zinc-500">
            Muốn thử trước khi đăng ký?{" "}
            <Link
              href="/playground"
              className="text-indigo-600 hover:underline"
            >
              Mở Playground
            </Link>{" "}
            để code Python ngay không cần tài khoản.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
