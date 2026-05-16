# 🐍 PyKids — Plan & Tiến độ

> Nền tảng web cho giáo viên ra bài tập Python và học sinh cấp 1, 2 làm bài trực tuyến. Chấm tự động, deploy miễn phí trên Vercel.

---

## 📐 Tech Stack

| Layer | Công nghệ | Tình trạng |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | ✅ |
| UI | Tailwind CSS v4 + shadcn-style components | ✅ |
| Code editor | Monaco Editor (`@monaco-editor/react`) | ✅ |
| Python runtime | Pyodide (Web Worker, sandboxed) | ✅ |
| Database | Neon Postgres serverless | ✅ |
| ORM | Drizzle ORM | ✅ |
| Auth | NextAuth v5 (Credentials, JWT) | ✅ |
| Deploy | Vercel free tier | ⏳ Phase 5 |

---

## 🗄️ Database Schema (đã push lên Neon)

- `users` — id, email, password_hash, full_name, role (`teacher`/`student`), grade_level
- `classes` — id, teacher_id, name, code (mã mời), grade_level
- `class_members` — class_id, student_id (M-N)
- `exercises` — id, class_id, title, description (markdown), difficulty (`cap1`/`cap2`), starter_code, solution_code
- `test_cases` — id, exercise_id, type (`stdin_stdout`/`function_check`/`custom_script`), input, expected_output, hidden, weight, order_index
- `submissions` — id, exercise_id, student_id, code, score, passed_count, total_count, results (jsonb)

Enums: `role`, `difficulty`, `test_type`.

---

## 🗺️ Roadmap

### ✅ Phase 1 — Core MVP (HOÀN THÀNH)

- [x] Scaffold Next.js + TypeScript + Tailwind v4
- [x] Cài deps: NextAuth, Drizzle, Neon, Monaco, Pyodide, zod, bcryptjs
- [x] Drizzle schema + Neon connection (`src/lib/db/`)
- [x] NextAuth credentials provider với role teacher/student (`src/lib/auth.ts`)
- [x] Augment session type với `role` (`src/types/next-auth.d.ts`)
- [x] API signup route (`src/app/api/signup/route.ts`)
- [x] Pyodide Web Worker (`public/pyodide-worker.js`)
- [x] Pyodide client + grader (`src/lib/pyodide/runner.ts`) — hỗ trợ stdin/stdout, function_check, custom_script
- [x] Monaco editor wrapper (`src/components/code-editor.tsx`)
- [x] UI components: Button, Input, Card, Label (`src/components/ui/`)
- [x] Landing page tiếng Việt (`src/app/page.tsx`)
- [x] Login + Signup pages (`src/app/(auth)/`)
- [x] Python Playground (`src/app/playground/page.tsx`) — chạy không cần đăng nhập
- [x] Dashboard placeholder (`src/app/dashboard/page.tsx`)
- [x] README + `.env.example`
- [x] `db:push` thành công lên Neon — schema đã có trên cloud
- [x] TypeScript clean + `npm run build` pass
- [x] Dev server chạy được trên `localhost:3000`

---

### ✅ Phase 2 — Giáo viên tạo lớp + bài tập (HOÀN THÀNH)

**Mục tiêu:** Giáo viên có thể tạo lớp, sinh mã mời, viết bài tập Python với test cases.

- [x] Auth helpers: `requireUser`, `requireTeacher`, `requireStudent` (`src/lib/auth-helpers.ts`)
- [x] Layout có guard `(authenticated)` với nav theo role + nút logout (`src/app/(authenticated)/layout.tsx`)
- [x] Dashboard redirect theo role (`(authenticated)/dashboard/page.tsx`)
- [x] UI: thêm Textarea + Select component
- [x] Trang `/teacher/classes` — danh sách lớp, empty state đẹp
- [x] Trang `/teacher/classes/new` — form tạo lớp dùng `useActionState`, tự sinh code 6 ký tự (chống trùng)
- [x] Trang `/teacher/classes/[id]` — chi tiết lớp: hiển thị mã mời to, list bài tập, list học sinh, nút xóa lớp
- [x] Server Actions: `createClass`, `deleteClass`, `removeStudent` (`src/lib/actions/classes.ts`)
- [x] Trang `/teacher/classes/[id]/exercises/new` — tạo bài tập trong lớp
- [x] Trang `/teacher/exercises/[id]/edit` — sửa bài tập + xóa
- [x] **Exercise editor component** (`src/components/exercise-editor.tsx`):
  - Title, description (textarea), difficulty (cap1/cap2)
  - Starter code (Monaco), Solution code (Monaco — ẩn với học sinh)
  - Test cases động: add/remove/sắp xếp, 3 kiểu (`stdin_stdout`, `function_check`, `custom_script`)
  - Mỗi test: hidden checkbox, weight, input, expected output
  - Nút "▶ Chạy đáp án qua tests" — verify đáp án pass tất cả tests trước khi save (chạy Pyodide client-side)
- [x] Server Actions: `createExercise`, `updateExercise`, `deleteExercise` với zod validation + ownership check (`src/lib/actions/exercises.ts`)
- [x] Student route placeholders để nav không 404 (Phase 3 sẽ thay thế)
- [x] TypeScript clean + production build pass (13 routes)

---

### ✅ Phase 3 — Học sinh làm bài (HOÀN THÀNH)

**Mục tiêu:** Học sinh join lớp bằng mã, làm bài, nộp bài, nhận điểm tự động.

- [x] Server Actions: `joinClass`, `leaveClass` (`src/lib/actions/student.ts`)
- [x] Server Action `submitExercise` (`src/lib/actions/submissions.ts`) — verify membership, chạy ownership check, tính điểm theo weight, lưu submission với JSONB results
- [x] Trang `/student/join` — form nhập mã lớp 6 ký tự (auto-uppercase, font lớn)
- [x] Trang `/student/classes` — danh sách lớp đã join, hiển thị tên giáo viên + grade
- [x] Trang `/student/classes/[id]` — danh sách bài tập, hiển thị "Chưa làm" hoặc điểm cao nhất theo màu (xanh nếu 100, vàng nếu thấp hơn)
- [x] Trang `/student/exercises/[id]` — solve view với Exercise Solver component
- [x] **Exercise Solver component** (`src/components/exercise-solver.tsx`):
  - Layout 2 cột: đề bài (markdown-style) + code editor
  - Hiển thị test cases public (ẩn các test hidden, chỉ báo "có N test ẩn")
  - Code editor Monaco — font lớn hơn cho cấp 1 (16px)
  - Nút "▶ Chạy thử" — input stdin tự nhập, output ngay không lưu
  - Nút "📤 Nộp bài" — chạy hết tests (cả hidden), tính điểm, lưu submission
  - Hiển thị từng test: ✅/❌, nếu fail và không hidden thì show expected vs actual
  - Tự load code từ submission gần nhất để học sinh sửa tiếp
  - Badge "Điểm cao nhất: X/100"
- [x] Rời lớp được từ class detail page

---

### ✅ Phase 4 — Theo dõi & polish (HOÀN THÀNH phần core)

**Mục tiêu:** Giáo viên xem ai làm bài nào, điểm bao nhiêu. UI/UX cho cấp 1.

- [x] Trang `/teacher/classes/[id]/progress` — bảng điểm 2D: hàng = học sinh, cột = bài tập, ô màu (xanh ≥100, vàng ≥50, đỏ <50), cột TB tự tính
- [x] UI cấp 1: font to (16px editor + heading 4xl), nội dung đề bài size lớn hơn
- [x] **Friendly Vietnamese error mapping** (`src/lib/pyodide/friendly-errors.ts`):
  - SyntaxError → "Cú pháp sai, có thể thiếu dấu hai chấm hoặc ngoặc"
  - NameError → "Tên X chưa khai báo. Kiểm tra chính tả"
  - TypeError (cộng số với chữ) → "Sai kiểu dữ liệu, dùng int()/str() để đổi"
  - IndentationError → "Thụt lề chưa đều, đừng trộn tab với space"
  - ZeroDivisionError → "Không chia được cho 0"
  - IndexError → "Lấy phần tử ngoài danh sách. Index bắt đầu từ 0"
  - EOFError → "Hết dữ liệu nhập rồi"
  - RecursionError → "Đệ quy quá sâu, kiểm tra điều kiện dừng"
  - 15+ patterns
- [ ] (Skip) Dark mode toggle manual — đang dùng auto theo OS, đủ dùng
- [ ] (Skip) Mobile responsive làm bài — desktop-first, mobile sẽ work nhưng không tối ưu

---

### ⏳ Phase 5 — Deploy (CHỜ USER thực hiện)

Hướng dẫn deploy chi tiết đã viết trong [README.md](./README.md#deploy-vercel-free). Tóm tắt:

- [ ] Rotate Neon password (vì đã paste 1 lần qua chat)
- [ ] Sinh `AUTH_SECRET` mới cho production
- [ ] Push GitHub: `git init && git add . && git commit && gh repo create ...`
- [ ] Vercel: Import repo → set 2 env vars → Deploy
- [ ] (Optional) Custom domain

Production build đã verify pass — 17 routes (4 static, 13 dynamic).

---

## 📂 Cấu trúc thư mục hiện tại

```
pykids/
├── public/
│   └── pyodide-worker.js        # Web Worker chạy Python
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── signup/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── playground/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx             # Landing
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── code-editor.tsx
│   │   └── providers.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts         # Drizzle client (lazy)
│   │   │   └── schema.ts        # 6 bảng + relations
│   │   ├── pyodide/runner.ts    # Client + grader
│   │   ├── auth.ts              # NextAuth config
│   │   └── utils.ts             # cn(), generateClassCode()
│   └── types/next-auth.d.ts     # Session augment
├── drizzle.config.ts
├── .env.local                   # ⚠️ gitignored — chứa secrets
├── .env.example
├── Plan.md                      # File này
└── README.md
```

---

## ⚠️ Notes / Decisions / Gotchas

- **`drizzle-kit` không tự đọc `.env.local`** — phải `config({ path: ".env.local" })` trong `drizzle.config.ts`. Đã fix.
- **`db/index.ts` dùng Proxy lazy** để build không cần `DATABASE_URL` (Next.js prerender static pages cần module load không throw).
- **Pyodide tải từ jsdelivr CDN** (~10MB lần đầu, cached) — không bundle vào app.
- **Stdin được monkey-patch `builtins.input`** vì Pyodide không có stdin native trong worker. Hỗ trợ đủ cho bài tập cấp 1, 2.
- **Default timeout chạy code: 5 giây** — đủ cho bài cấp 1, 2. Nếu timeout, worker bị `terminate()` rồi tạo lại lần sau.
- **Neon free tier không pause** (chỉ scale-to-zero, tự wake ~500ms) — tốt hơn Supabase free tier (pause sau 7 ngày).
- **`AUTH_SECRET` trong `.env.local` hiện tại chỉ dùng cho dev.** Khi deploy Vercel phải sinh chuỗi mới, set trong Vercel env vars.
- **Password Neon đã paste vào chat 1 lần** — sau khi xong nên Reset password trong Neon Console → Settings → Reset password, rồi update `.env.local`.

---

## 🚦 Đang ở đâu?

**Hoàn thành Phase 1, 2, 3, 4. Chỉ còn Phase 5 (deploy) cần user thao tác trên Vercel.**

Full flow đã chạy được local:

**Giáo viên:**
1. Đăng ký giáo viên → `/teacher/classes`
2. Tạo lớp → có mã mời 6 ký tự
3. Tạo bài tập → starter code + đáp án + nhiều test cases
4. "▶ Chạy đáp án qua tests" để verify trước khi lưu
5. Xem `/teacher/classes/[id]/progress` — bảng điểm 2D

**Học sinh:**
1. Đăng ký học sinh → `/student/classes`
2. "+ Tham gia lớp" → nhập mã 6 ký tự
3. Vào lớp → chọn bài tập → solve view (đề bài, code editor, run/submit)
4. Nộp bài → tự chấm tức thì, hiển thị từng test ✅/❌ + lý do fail
5. Lỗi Python được dịch sang tiếng Việt thân thiện (cho cấp 1)

**Build pass** — 17 routes (4 static, 13 dynamic). TypeScript clean.
