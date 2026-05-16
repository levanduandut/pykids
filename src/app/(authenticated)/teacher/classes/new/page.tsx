"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createClass } from "@/lib/actions/classes";
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

export default function NewClassPage() {
  const [state, formAction, pending] = useActionState(createClass, undefined);

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Tạo lớp mới</CardTitle>
          <CardDescription>
            Sau khi tạo, hệ thống sinh mã 6 ký tự để học sinh tham gia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Tên lớp</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Ví dụ: 6A1 - Python cơ bản"
                maxLength={80}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gradeLevel">Khối lớp</Label>
              <Select id="gradeLevel" name="gradeLevel" defaultValue="6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                  <option key={g} value={g}>
                    Lớp {g} {g <= 5 ? "(Cấp 1)" : "(Cấp 2)"}
                  </option>
                ))}
              </Select>
            </div>
            {state?.error && (
              <p className="text-sm text-rose-600">{state.error}</p>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Link href="/teacher/classes">
                <Button variant="ghost" type="button">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={pending}>
                {pending ? "Đang tạo..." : "Tạo lớp"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
