"use client";

import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Props = {
  email: string;
  role: "teacher" | "student";
  initialFullName: string;
  initialGradeLevel: number | null;
};

export function ProfileForm({
  email,
  role,
  initialFullName,
  initialGradeLevel,
}: Props) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined);
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      const input = document.getElementById("fullName") as HTMLInputElement | null;
      const newName = input?.value.trim();
      if (newName) {
        void update({ name: newName }).then(() => router.refresh());
      } else {
        router.refresh();
      }
    }
  }, [state, update, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin tài khoản</CardTitle>
        <CardDescription>
          Email không thể đổi. Bạn có thể đổi họ tên hiển thị
          {role === "student" ? " và lớp đang học" : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Vai trò</Label>
            <Input
              id="role"
              value={role === "teacher" ? "Giáo viên" : "Học sinh"}
              disabled
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              name="fullName"
              required
              defaultValue={initialFullName}
              maxLength={80}
            />
          </div>

          {role === "student" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="gradeLevel">Lớp đang học</Label>
              <Select
                id="gradeLevel"
                name="gradeLevel"
                defaultValue={String(initialGradeLevel ?? 6)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                  <option key={g} value={g}>
                    Lớp {g}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {state?.error && (
            <p className="text-sm text-rose-600">{state.error}</p>
          )}
          {state?.ok && (
            <p className="text-sm text-emerald-600">Đã lưu thay đổi ✓</p>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
