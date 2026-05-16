import Link from "next/link";
import {
  DocSection,
  Steps,
  Tip,
  Warning,
  Code,
} from "../_components/section";
import { Card } from "@/components/ui/card";

export default function TeacherGuidePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="text-sm text-zinc-500">
          <Link href="/docs" className="hover:underline">
            ← Trang hướng dẫn
          </Link>
        </div>
        <h1 className="mt-2 text-4xl font-bold">
          👩‍🏫 Hướng dẫn cho Giáo viên
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Mục lục: Đăng ký → Tạo lớp → Ra bài tập → Theo dõi học sinh → Quản
          lý.
        </p>
      </div>

      <nav className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="font-semibold">📌 Đi tới:</p>
        <ol className="ml-5 mt-2 list-decimal space-y-1 text-indigo-600 dark:text-indigo-400">
          <li>
            <a href="#dang-ky" className="hover:underline">
              Đăng ký tài khoản giáo viên
            </a>
          </li>
          <li>
            <a href="#tao-lop" className="hover:underline">
              Tạo lớp học đầu tiên
            </a>
          </li>
          <li>
            <a href="#chia-se-lop" className="hover:underline">
              Chia sẻ mã lớp cho học sinh
            </a>
          </li>
          <li>
            <a href="#ra-bai" className="hover:underline">
              Ra bài tập (tự viết hoặc tải bộ mẫu)
            </a>
          </li>
          <li>
            <a href="#test-cases" className="hover:underline">
              3 kiểu test case và khi nào dùng
            </a>
          </li>
          <li>
            <a href="#xac-minh" className="hover:underline">
              Xác minh đáp án trước khi lưu
            </a>
          </li>
          <li>
            <a href="#theo-doi" className="hover:underline">
              Theo dõi tiến độ, bảng điểm, xếp hạng
            </a>
          </li>
          <li>
            <a href="#quan-ly" className="hover:underline">
              Quản lý học sinh & lịch sử nộp bài
            </a>
          </li>
          <li>
            <a href="#meo" className="hover:underline">
              Mẹo dạy hiệu quả
            </a>
          </li>
        </ol>
      </nav>

      <DocSection number="1" title="Đăng ký tài khoản giáo viên" >
        <p id="dang-ky">
          Tài khoản giáo viên cần <strong>mã xác nhận</strong> để tránh đăng
          ký tràn lan.
        </p>
        <Steps>
          <li>
            Vào{" "}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Trang đăng ký
            </Link>
          </li>
          <li>
            Bấm chọn ô <strong>👩‍🏫 Giáo viên</strong> (mặc định đang chọn Học
            sinh)
          </li>
          <li>Điền họ tên, email, mật khẩu (≥ 6 ký tự)</li>
          <li>
            Nhập <strong>Mã giáo viên</strong> do quản trị viên cung cấp (mặc
            định: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">3001</code>)
          </li>
          <li>
            Bấm <strong>Đăng ký</strong> → tự động đăng nhập + chuyển vào
            dashboard
          </li>
        </Steps>
        <Warning>
          Nếu nhập sai mã giáo viên, hệ thống báo "Mã giáo viên không đúng".
          Liên hệ quản trị viên để xin mã.
        </Warning>
      </DocSection>

      <DocSection number="2" title="Tạo lớp học đầu tiên">
        <p id="tao-lop">
          Lớp học là nơi chứa danh sách học sinh + bài tập. Một giáo viên có
          thể tạo nhiều lớp.
        </p>
        <Steps>
          <li>
            Sau khi đăng nhập, vào <strong>Lớp của tôi</strong> trên thanh
            menu
          </li>
          <li>
            Bấm nút <strong>+ Tạo lớp mới</strong> (góc phải trên)
          </li>
          <li>
            Nhập <strong>Tên lớp</strong> (vd: "6A1 — Python cơ bản") và chọn{" "}
            <strong>khối lớp</strong> (Lớp 1-9)
          </li>
          <li>
            Bấm <strong>Tạo lớp</strong>
          </li>
        </Steps>
        <p>
          Sau khi tạo, hệ thống tự sinh <strong>mã lớp 6 ký tự</strong> (vd:{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            ABC123
          </code>
          ) và đưa bạn vào trang chi tiết lớp.
        </p>
      </DocSection>

      <DocSection number="3" title="Chia sẻ mã lớp cho học sinh">
        <p id="chia-se-lop">
          Học sinh dùng mã 6 ký tự để tham gia lớp. Mã hiển thị lớn ở đầu
          trang chi tiết lớp.
        </p>
        <Steps>
          <li>Vào trang chi tiết lớp</li>
          <li>
            Copy đoạn code dạng{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
              ABC123
            </code>{" "}
            ở phần "Mã mời"
          </li>
          <li>
            Gửi cho học sinh qua Zalo / Email / viết lên bảng. Học sinh sẽ vào{" "}
            <strong>Tham gia lớp</strong> trên app để nhập mã
          </li>
        </Steps>
        <Tip>
          Mã không phân biệt hoa thường — học sinh nhập <code>abc123</code>{" "}
          hay <code>ABC123</code> đều được.
        </Tip>
      </DocSection>

      <DocSection number="4" title="Ra bài tập">
        <p id="ra-bai">Có 2 cách:</p>

        <h3 className="mt-2 font-semibold">
          🚀 Cách nhanh — Tải bộ bài mẫu (26 bài)
        </h3>
        <p>
          Trong lớp <strong>chưa có bài tập nào</strong>, sẽ hiện nút{" "}
          <strong>📚 Tải bộ bài mẫu (26 bài)</strong>. Bấm 1 phát → toàn bộ
          giáo trình 24 buổi cho cấp 2 sẽ được import vào lớp, kèm test cases.
        </p>
        <Warning>
          Nút này chỉ hiện khi lớp **trống**. Sau khi tải xong sẽ ẩn để tránh
          tải trùng.
        </Warning>

        <h3 className="mt-4 font-semibold">✏️ Cách tự viết</h3>
        <Steps>
          <li>
            Trong trang chi tiết lớp, bấm <strong>+ Tạo bài tập</strong>
          </li>
          <li>
            Điền <strong>Tiêu đề</strong> và <strong>Mô tả</strong> (hỗ trợ
            markdown đơn giản — dấu *, `code`, **đậm**)
          </li>
          <li>
            Chọn <strong>Cấp độ</strong>: Cấp 1 (lớp 1-5) hay Cấp 2 (lớp 6-9)
            — ảnh hưởng font size và độ thân thiện của báo lỗi
          </li>
          <li>
            Trong khung <strong>Code mẫu (cho học sinh)</strong>: viết starter
            code, học sinh sẽ thấy code này khi mở bài
          </li>
          <li>
            Trong khung <strong>Đáp án (ẩn với học sinh)</strong>: viết solution
            đúng — chỉ giáo viên thấy, dùng để xác minh test
          </li>
          <li>Thêm test cases (xem mục 5)</li>
          <li>
            Bấm <strong>▶ Chạy đáp án qua tests</strong> để xác minh đáp án
            pass hết test
          </li>
          <li>
            Bấm <strong>Tạo bài tập</strong> để lưu
          </li>
        </Steps>
      </DocSection>

      <DocSection
        number="5"
        title="3 kiểu test case và khi nào dùng"
      >
        <p id="test-cases">PyKids hỗ trợ 3 kiểu test case:</p>

        <h3 className="font-semibold">
          1. stdin / stdout — dùng cho bài có{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            input()
          </code>
          /
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            print()
          </code>
        </h3>
        <p>
          Hệ thống cung cấp <strong>Input</strong> qua stdin (mỗi dòng = 1 lần
          gọi <code>input()</code>) và so sánh <strong>output thực tế</strong>{" "}
          (qua <code>print</code>) với <strong>Output mong đợi</strong>.
        </p>
        <Code>{`Input:  3
5
Output: 8`}</Code>
        <p>
          Code học sinh: <code>a = int(input()); b = int(input()); print(a+b)</code>
        </p>

        <h3 className="mt-4 font-semibold">
          2. assert — dùng cho bài viết <strong>hàm</strong>
        </h3>
        <p>
          Trong ô <strong>Input</strong>, viết đoạn code <code>assert ...</code>{" "}
          gọi hàm của học sinh. Hệ thống chạy code học sinh + đoạn assert; nếu
          assert pass thì test pass.
        </p>
        <Code>{`Input: assert tinh_tong(2, 3) == 5`}</Code>
        <p>
          Code học sinh: <code>def tinh_tong(a, b): return a + b</code>
        </p>
        <p>
          Ô <strong>Output mong đợi</strong> không dùng cho kiểu này (để
          trống).
        </p>

        <h3 className="mt-4 font-semibold">
          3. custom script — dùng cho bài phức tạp
        </h3>
        <p>
          Bạn viết toàn bộ đoạn Python kiểm tra trong ô <strong>Input</strong>{" "}
          (nhiều dòng, có thể chạy hàm + print). Nếu có <strong>Output mong
          đợi</strong>, hệ thống so sánh stdout.
        </p>
        <Code>{`Input:
ket_qua = sap_xep([3, 1, 4, 1, 5])
print(ket_qua)
assert ket_qua == [1, 1, 3, 4, 5]
Output: [1, 1, 3, 4, 5]`}</Code>

        <h3 className="mt-4 font-semibold">📌 Tùy chọn của mỗi test</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Ẩn với học sinh</strong> — Test ẩn giúp chống học sinh "hack"
            bằng cách hard-code kết quả. Học sinh chỉ thấy ✅/❌ chứ không thấy
            input/output. <strong>Nên có ít nhất 1 test ẩn</strong> cho mỗi
            bài.
          </li>
          <li>
            <strong>Điểm (weight)</strong> — Test khó có thể đặt weight cao
            hơn. Điểm cuối = (tổng weight pass / tổng weight) × 100.
          </li>
        </ul>
      </DocSection>

      <DocSection number="6" title="Xác minh đáp án trước khi lưu">
        <p id="xac-minh">
          <strong>Quan trọng:</strong> trước khi lưu, luôn bấm{" "}
          <strong>▶ Chạy đáp án qua tests</strong> để chắc chắn đáp án bạn viết
          pass <strong>tất cả</strong> test cases.
        </p>
        <Steps>
          <li>Cuộn xuống cuối trang tạo bài tập</li>
          <li>
            Bấm <strong>▶ Chạy đáp án qua tests</strong>
          </li>
          <li>
            Đợi ~3-5s (lần đầu cần tải Python ~10MB, lần sau nhanh hơn)
          </li>
          <li>
            Kết quả ✅ "Đáp án vượt qua N/N test cases" — OK, lưu được
          </li>
          <li>
            Kết quả ❌ "Đáp án chỉ qua X/N" — sửa lại đáp án hoặc test case
            trước khi lưu
          </li>
        </Steps>
        <Tip>
          Nếu test fail vì lỗi nhỏ (vd: space thừa, newline cuối), hệ thống
          tự bỏ qua <code>trimEnd()</code> — không lo về dòng trắng cuối.
        </Tip>
      </DocSection>

      <DocSection number="7" title="Theo dõi tiến độ, bảng điểm, xếp hạng">
        <p id="theo-doi">
          Trang chi tiết lớp có 3 nút trên góc phải:
        </p>

        <h3 className="mt-2 font-semibold">🏆 Xếp hạng</h3>
        <p>
          Bảng xếp hạng học sinh trong lớp theo <strong>tổng điểm</strong>{" "}
          (tổng score cao nhất mỗi bài). Tie-break: số bài hoàn hảo &gt; thời
          gian làm. Top 3 có huy chương 🥇🥈🥉. Học sinh cũng xem được — đây
          là động lực để các em thi đua.
        </p>

        <h3 className="mt-2 font-semibold">📊 Tiến độ</h3>
        <p>
          Bảng 2D: <strong>hàng = học sinh</strong>,{" "}
          <strong>cột = bài tập</strong>. Mỗi ô là điểm cao nhất của học sinh
          đó ở bài đó. Màu sắc:
        </p>
        <ul className="ml-5 list-disc">
          <li>🟢 Xanh = 100/100 (hoàn hảo)</li>
          <li>🟡 Vàng = ≥ 50</li>
          <li>🔴 Đỏ = &lt; 50</li>
          <li>⚪ "—" = chưa nộp</li>
        </ul>
        <p>Cột cuối "TB" tự tính điểm trung bình của từng học sinh.</p>

        <h3 className="mt-2 font-semibold">📜 Lịch sử nộp (mỗi bài tập)</h3>
        <p>
          Trong trang chi tiết lớp, mỗi bài tập có link <strong>Lịch sử nộp</strong>
          . Bấm vào để xem <strong>tất cả</strong> lần nộp của <strong>mọi
          học sinh</strong> cho bài đó: điểm, thời gian làm, code đã nộp.
        </p>
      </DocSection>

      <DocSection number="8" title="Quản lý học sinh & lịch sử nộp bài">
        <p id="quan-ly">Trong trang chi tiết lớp:</p>

        <h3 className="font-semibold">Mỗi học sinh có 2 nút:</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Xóa lịch sử</strong> (màu vàng) — xóa <strong>toàn bộ</strong>{" "}
            lần nộp bài của học sinh trong lớp này. Tài khoản học sinh + tư
            cách thành viên không bị ảnh hưởng. Dùng khi muốn reset cho học
            sinh làm lại.
          </li>
          <li>
            <strong>Rời lớp</strong> (màu đỏ) — xóa học sinh khỏi lớp này.
            Tài khoản học sinh không bị xóa, có thể join lại nếu có mã.
          </li>
        </ul>

        <h3 className="mt-3 font-semibold">Xóa 1 lần nộp cụ thể</h3>
        <p>
          Vào <strong>Lịch sử nộp</strong> của bài tập → mỗi dòng có nút{" "}
          <strong>Xóa</strong> để xóa chỉ 1 submission cụ thể.
        </p>

        <h3 className="mt-3 font-semibold">Sửa / xóa bài tập</h3>
        <p>
          Trong trang chi tiết lớp, bấm tên bài tập → vào trang sửa. Cuối
          trang có nút <strong>Xóa bài tập</strong> (sẽ xóa luôn lịch sử nộp).
        </p>

        <h3 className="mt-3 font-semibold">Xóa lớp</h3>
        <p>
          Phía dưới cùng trang chi tiết lớp có nút{" "}
          <strong>Xóa lớp này</strong>. <strong>Cẩn thận:</strong> xóa lớp =
          xóa luôn tất cả bài tập + lịch sử nộp của học sinh trong lớp.
        </p>
      </DocSection>

      <DocSection number="9" title="Mẹo dạy hiệu quả">
        <p id="meo"></p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Bắt đầu với bài đơn giản</strong> — Hello World, in biến.
            Cho học sinh quen với editor & nút Nộp bài trước.
          </li>
          <li>
            <strong>1-2 test public + ít nhất 1 test ẩn</strong> — Test public
            để học sinh hiểu yêu cầu, test ẩn để chấm thực sự.
          </li>
          <li>
            <strong>Mô tả rõ định dạng output</strong> — có space hay không,
            in trên 1 dòng hay nhiều dòng. Học sinh hay nhầm chỗ này.
          </li>
          <li>
            <strong>Dùng Cấp 1 cho lớp 1-5</strong> — font lớn hơn (16px), báo
            lỗi tiếng Việt thân thiện hơn (vd: "Cú pháp Python sai rồi" thay
            vì "SyntaxError").
          </li>
          <li>
            <strong>Đổi tên hiển thị</strong> — vào{" "}
            <Link
              href="/profile"
              className="text-indigo-600 hover:underline"
            >
              /profile
            </Link>{" "}
            để đổi tên hiển thị bất cứ lúc nào. Học sinh sẽ thấy tên mới.
          </li>
          <li>
            <strong>Theo dõi xếp hạng để cổ vũ</strong> — gọi tên top 3 trong
            buổi học sau, học sinh sẽ chăm chỉ hơn.
          </li>
          <li>
            <strong>Reset cho học sinh làm lại</strong> — nếu có học sinh bị
            điểm thấp và muốn làm lại từ đầu, dùng nút "Xóa lịch sử".
          </li>
        </ul>
      </DocSection>

      <Card>
        <CardContentFooter />
      </Card>
    </div>
  );
}

function CardContentFooter() {
  return (
    <div className="flex flex-col gap-2 p-6 text-center text-sm">
      <p>Vẫn còn thắc mắc?</p>
      <p>
        <Link
          href="/docs/hoc-sinh"
          className="text-indigo-600 hover:underline"
        >
          Xem hướng dẫn cho Học sinh →
        </Link>
      </p>
    </div>
  );
}
