import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "teacher") redirect("/teacher/classes");
  redirect("/student/classes");
}
