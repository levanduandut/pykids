"use client";

import Link from "next/link";
import { useActionState } from "react";
import { joinClass } from "@/lib/actions/student";
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

export default function JoinClassPage() {
  const [state, formAction, pending] = useActionState(joinClass, undefined);

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Tham gia lớp</CardTitle>
          <CardDescription>
            Hỏi giáo viên mã lớp 6 ký tự (ví dụ: <code>ABC123</code>) và nhập
            vào đây.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Mã lớp</Label>
              <Input
                id="code"
                name="code"
                required
                maxLength={10}
                placeholder="VD: ABC123"
                className="text-center font-mono text-2xl uppercase tracking-widest"
                autoComplete="off"
                autoFocus
              />
            </div>
            {state?.error && (
              <p className="text-sm text-rose-600">{state.error}</p>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Link href="/student/classes">
                <Button variant="ghost" type="button">
                  Hủy
                </Button>
              </Link>
              <Button type="submit" disabled={pending}>
                {pending ? "Đang tham gia..." : "Tham gia"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
