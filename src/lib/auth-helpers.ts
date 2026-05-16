import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireTeacher() {
  const user = await requireUser();
  if (user.role !== "teacher") redirect("/dashboard");
  return user;
}

export async function requireStudent() {
  const user = await requireUser();
  if (user.role !== "student") redirect("/dashboard");
  return user;
}
