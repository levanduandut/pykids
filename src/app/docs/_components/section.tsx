import { Card, CardContent } from "@/components/ui/card";

export function DocSection({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-3 text-2xl font-bold">
        {number && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-base text-white">
            {number}
          </span>
        )}
        {title}
      </h2>
      <Card>
        <CardContent className="flex flex-col gap-3 p-6 text-zinc-700 dark:text-zinc-300">
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

export function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="ml-6 list-decimal space-y-2">{children}</ol>;
}

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm dark:border-indigo-900 dark:bg-indigo-950/40">
      <strong className="text-indigo-700 dark:text-indigo-300">💡 Mẹo: </strong>
      <span>{children}</span>
    </div>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
      <strong className="text-amber-700 dark:text-amber-300">⚠️ Lưu ý: </strong>
      <span>{children}</span>
    </div>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-100">
      <code>{children}</code>
    </pre>
  );
}
