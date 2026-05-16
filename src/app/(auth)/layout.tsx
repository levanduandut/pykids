import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8 text-2xl font-bold">
        🐍 PyKids
      </Link>
      {children}
    </div>
  );
}
