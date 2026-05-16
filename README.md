# 🐍 PyKids

Nền tảng web giúp **giáo viên** ra bài tập Python và **học sinh cấp 1, 2** làm bài trực tuyến, chấm tự động — chạy hoàn toàn trong trình duyệt bằng [Pyodide](https://pyodide.org), deploy miễn phí trên Vercel.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Pyodide** chạy Python trong Web Worker (sandbox an toàn)
- **Monaco Editor** (editor của VSCode) cho viết code
- **Neon** Postgres serverless + **Drizzle ORM**
- **NextAuth v5** (Credentials provider, JWT session)
- **Tailwind CSS v4** + shadcn/ui style components
- **Vercel** deploy free tier

## Tính năng hiện tại (Phase 1 — MVP)

- ✅ Landing page tiếng Việt
- ✅ Đăng ký / đăng nhập với role `teacher` hoặc `student`
- ✅ Python Playground: viết code, chạy, xem output (có hỗ trợ `input()`)
- ✅ Schema DB đầy đủ: users, classes, class_members, exercises, test_cases, submissions
- ✅ Bộ runner tự chấm 3 kiểu test case: `stdin_stdout`, `function_check`, `custom_script`

## Đang làm tiếp (roadmap)

- ⏳ Phase 2 — Giáo viên: tạo lớp, sinh mã mời, CRUD bài tập + test cases
- ⏳ Phase 3 — Học sinh: join lớp, làm bài, nộp bài, xem điểm
- ⏳ Phase 4 — Dashboard giáo viên theo dõi tiến độ
- ⏳ Phase 5 — Deploy Vercel

## Setup local

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo database Neon (free)

1. Vào [console.neon.tech](https://console.neon.tech) → sign in với GitHub
2. Tạo project mới → chọn region gần nhất (`Asia Pacific (Singapore)` cho VN)
3. Copy `Connection string` (dạng `postgresql://...`)

### 3. Cấu hình env

```bash
cp .env.example .env.local
```

Sửa `.env.local`:
- `DATABASE_URL` — dán connection string từ Neon
- `AUTH_SECRET` — sinh bằng `openssl rand -base64 32`

### 4. Push schema lên Neon

```bash
npm run db:push
```

### 5. Chạy dev

```bash
npm run dev
```

Mở [localhost:3000](http://localhost:3000).

## Deploy Vercel (free)

### Chuẩn bị

1. **Rotate Neon password** (nếu đã từng paste connection string ra ngoài):
   - Neon Console → project → Settings → Reset password → copy connection string mới
   - Update `.env.local` để dev tiếp dùng được

2. **Sinh `AUTH_SECRET` mới cho production:**
   ```bash
   openssl rand -base64 32
   ```
   (Đừng dùng lại secret của dev)

### Push lên GitHub

```bash
cd /Users/Code/MBL/pykids
git add .
git commit -m "PyKids MVP — Phase 1-4 done"
gh repo create pykids --private --source=. --push
# Hoặc tạo repo thủ công trên github.com rồi:
# git remote add origin git@github.com:USERNAME/pykids.git
# git push -u origin main
```

⚠️ `.env.local` đã được gitignore — sẽ KHÔNG bị push lên GitHub.

### Deploy Vercel

1. Mở [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → chọn `pykids`
3. Ở phần **Environment Variables**, thêm:
   - `DATABASE_URL` = connection string Neon production (rotate xong)
   - `AUTH_SECRET` = chuỗi 32 bytes mới sinh
   - (Không cần `AUTH_URL` — NextAuth v5 tự dùng `VERCEL_URL`)
4. Bấm **Deploy** → đợi 1-2 phút
5. Mở URL Vercel cho → app chạy được luôn

### Sau khi deploy

- Schema database đã có sẵn (vì cùng Neon project với local)
- Nếu sau này sửa schema: `npm run db:push` từ máy local (kết nối Neon production)
- Setup custom domain ở Vercel project settings (optional)

### Tránh database pause

Neon free tier **không pause** (chỉ scale-to-zero ~500ms tự wake). Yên tâm.

### Monitoring chi phí

- **Vercel:** 100GB bandwidth/tháng free, đủ cho vài trăm học sinh dùng đều
- **Neon:** 0.5GB storage, 191.9 compute hours/tháng → đủ vài chục lớp
- Khi vượt: cả 2 đều có alert qua email, không tự tính tiền

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/login, signup    # Trang đăng nhập / đăng ký
│   ├── api/auth, signup         # Route handlers
│   ├── dashboard/               # Dashboard (chung cho teacher/student)
│   ├── playground/              # Python playground không cần đăng nhập
│   ├── layout.tsx
│   └── page.tsx                 # Landing
├── components/
│   ├── code-editor.tsx          # Monaco wrapper
│   ├── providers.tsx            # SessionProvider
│   └── ui/                      # Button, Input, Card, Label
├── lib/
│   ├── auth.ts                  # NextAuth config
│   ├── db/                      # Drizzle schema + client
│   ├── pyodide/runner.ts        # Pyodide client + grader
│   └── utils.ts
└── types/next-auth.d.ts         # Augment session với role
public/
└── pyodide-worker.js            # Web Worker chạy Python
```

## Pyodide notes

- Pyodide tải ~10MB lần đầu (từ jsdelivr CDN), cached sau đó
- Code chạy trong Web Worker → không lag UI, có thể `terminate()` khi timeout
- Stdin được truyền bằng cách monkeypatch `builtins.input` với các dòng cho trước
- Default timeout: 5 giây (đủ cho bài cấp 1, 2)

## License

MIT
