import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-helpers";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const sessionUser = await requireUser();

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, sessionUser.id),
  });

  if (!dbUser) {
    throw new Error("Không tìm thấy người dùng");
  }

  return (
    <div className="mx-auto max-w-xl">
      <ProfileForm
        email={dbUser.email}
        role={dbUser.role}
        initialFullName={dbUser.fullName}
        initialGradeLevel={dbUser.gradeLevel}
      />
    </div>
  );
}
