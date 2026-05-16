import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";

export type LeaderboardRow = {
  studentId: string;
  studentName: string;
  totalPoints: number; // sum of best scores
  exercisesDone: number;
  totalDurationSeconds: number;
  perfectCount: number; // số bài đạt 100
};

type Props = {
  rows: LeaderboardRow[];
  totalExercises: number;
  highlightStudentId?: string;
  className?: string;
  backHref?: string;
  backLabel?: string;
};

export function Leaderboard({
  rows,
  totalExercises,
  highlightStudentId,
  className,
  backHref,
  backLabel,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        {backHref && backLabel && (
          <div className="text-sm text-zinc-500">
            <Link href={backHref} className="hover:underline">
              ← {backLabel}
            </Link>
          </div>
        )}
        <h1 className="mt-1 text-3xl font-bold">
          🏆 Bảng xếp hạng{className ? ` — ${className}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Xếp theo tổng điểm (cao nhất mỗi bài), tổng có {totalExercises} bài tập.
          Tie-break: số bài hoàn hảo &gt; thời gian làm.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-zinc-500">
            Chưa ai nộp bài lần nào.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {rows.length} học sinh tham gia
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500 dark:border-zinc-800">
                  <th className="w-12 px-4 py-3">#</th>
                  <th className="px-4 py-3">Học sinh</th>
                  <th className="px-4 py-3 text-right">Tổng điểm</th>
                  <th className="px-4 py-3 text-right">Hoàn hảo</th>
                  <th className="px-4 py-3 text-right">Đã làm</th>
                  <th className="px-4 py-3 text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const rank = idx + 1;
                  const isMe = r.studentId === highlightStudentId;
                  const medal =
                    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
                  return (
                    <tr
                      key={r.studentId}
                      className={`border-b border-zinc-100 dark:border-zinc-900 ${
                        isMe ? "bg-indigo-50 dark:bg-indigo-950/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-bold">
                        {medal ?? rank}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{r.studentName}</span>
                        {isMe && (
                          <span className="ml-2 rounded-full bg-indigo-200 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            bạn
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {r.totalPoints}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.perfectCount}
                        <span className="text-xs text-zinc-400">
                          /{totalExercises}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.exercisesDone}
                        <span className="text-xs text-zinc-400">
                          /{totalExercises}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-500">
                        {formatDuration(r.totalDurationSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
