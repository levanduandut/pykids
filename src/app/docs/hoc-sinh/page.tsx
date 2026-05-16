import Link from "next/link";
import {
  DocSection,
  Steps,
  Tip,
  Warning,
  Code,
} from "../_components/section";
import { Card } from "@/components/ui/card";

export default function StudentGuidePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="text-sm text-zinc-500">
          <Link href="/docs" className="hover:underline">
            ← Trang hướng dẫn
          </Link>
        </div>
        <h1 className="mt-2 text-4xl font-bold">
          🎒 Hướng dẫn cho Học sinh
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Đăng ký → Tham gia lớp → Làm bài → Nộp bài → Xem điểm.
        </p>
      </div>

      <nav className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="font-semibold">📌 Đi tới:</p>
        <ol className="ml-5 mt-2 list-decimal space-y-1 text-indigo-600 dark:text-indigo-400">
          <li>
            <a href="#dang-ky" className="hover:underline">
              Đăng ký tài khoản học sinh
            </a>
          </li>
          <li>
            <a href="#tham-gia" className="hover:underline">
              Tham gia lớp bằng mã
            </a>
          </li>
          <li>
            <a href="#lam-bai" className="hover:underline">
              Làm bài tập Python
            </a>
          </li>
          <li>
            <a href="#chay-thu" className="hover:underline">
              Chạy thử trước khi nộp
            </a>
          </li>
          <li>
            <a href="#nop-bai" className="hover:underline">
              Nộp bài và xem điểm
            </a>
          </li>
          <li>
            <a href="#bao-loi" className="hover:underline">
              Hiểu báo lỗi tiếng Việt
            </a>
          </li>
          <li>
            <a href="#lich-su" className="hover:underline">
              Lịch sử nộp bài & điểm cao nhất
            </a>
          </li>
          <li>
            <a href="#xep-hang" className="hover:underline">
              Bảng xếp hạng
            </a>
          </li>
          <li>
            <a href="#meo" className="hover:underline">
              Mẹo làm bài tốt hơn
            </a>
          </li>
        </ol>
      </nav>

      <DocSection number="1" title="Đăng ký tài khoản học sinh">
        <p id="dang-ky">
          Đăng ký miễn phí, không cần mã xác nhận như giáo viên.
        </p>
        <Steps>
          <li>
            Vào{" "}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Trang đăng ký
            </Link>
          </li>
          <li>
            Bấm chọn ô <strong>🎒 Học sinh</strong> (mặc định đang chọn sẵn)
          </li>
          <li>Điền họ tên, email, mật khẩu (≥ 6 ký tự)</li>
          <li>Chọn lớp đang học (Lớp 1-9)</li>
          <li>
            Bấm <strong>Đăng ký</strong> → tự động đăng nhập + chuyển tới
            trang Lớp đã tham gia
          </li>
        </Steps>
        <Tip>
          Dùng email mà bạn nhớ rõ — đây là cách duy nhất để đăng nhập lại
          sau này.
        </Tip>
      </DocSection>

      <DocSection number="2" title="Tham gia lớp bằng mã">
        <p id="tham-gia">
          Giáo viên sẽ cho bạn <strong>mã lớp 6 ký tự</strong> (ví dụ:{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            ABC123
          </code>
          ).
        </p>
        <Steps>
          <li>
            Trên thanh menu, bấm <strong>Tham gia lớp</strong>
          </li>
          <li>
            Nhập mã 6 ký tự vào ô. Không phân biệt chữ hoa/thường —{" "}
            <code>abc123</code> hay <code>ABC123</code> đều được
          </li>
          <li>
            Bấm <strong>Tham gia</strong> → vào ngay trang lớp đó
          </li>
        </Steps>
        <Warning>
          Nếu báo "Không tìm thấy lớp với mã này", kiểm tra lại mã hoặc hỏi
          giáo viên xem có gõ nhầm không. Mã không có chữ <code>O</code>{" "}
          (chữ O) và số <code>0</code> ở cùng một mã — chỉ một trong hai để
          tránh nhầm lẫn.
        </Warning>
      </DocSection>

      <DocSection number="3" title="Làm bài tập Python">
        <p id="lam-bai">
          Trong lớp, bấm vào tên 1 bài tập → vào trang làm bài. Bố cục:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Cột trái</strong> — Đề bài, ví dụ test cases (test không
            ẩn). Đọc kỹ trước khi viết code!
          </li>
          <li>
            <strong>Cột phải</strong> — Editor code Python (giống VSCode), kèm
            nút "Chạy thử" và "Nộp bài"
          </li>
          <li>
            <strong>Phía dưới</strong> — Khu chạy thử và xem kết quả
          </li>
        </ul>
        <p>Bắt đầu bằng cách:</p>
        <Steps>
          <li>Đọc đề kỹ — chú ý định dạng input/output</li>
          <li>
            Click vào editor → bắt đầu gõ code Python. Đã có sẵn{" "}
            <strong>code mẫu</strong> (starter code) do giáo viên cung cấp
          </li>
          <li>Có thể bấm Tab để thụt lề, Shift+Tab để bỏ thụt lề</li>
        </Steps>
        <Tip>
          Lần đầu tải Python ~10MB (chờ vài giây), sau đó cache lại nên các
          bài sau load tức thì.
        </Tip>
      </DocSection>

      <DocSection number="4" title="Chạy thử trước khi nộp">
        <p id="chay-thu">
          <strong>Quan trọng:</strong> chạy thử <strong>không tính điểm</strong>{" "}
          — chỉ để bạn xem code có chạy đúng không trước khi nộp chính thức.
        </p>
        <Steps>
          <li>
            Viết code trong editor
          </li>
          <li>
            Nếu bài có dùng <code>input()</code>: gõ dữ liệu nhập vào ô{" "}
            <strong>"Dữ liệu nhập cho input()"</strong> ở dưới (mỗi dòng = 1
            lần gọi <code>input()</code>)
          </li>
          <li>
            Bấm <strong>▶ Chạy thử</strong>
          </li>
          <li>
            Xem output ở ô <strong>Kết quả</strong>. Nếu có lỗi, sẽ hiện báo
            lỗi tiếng Việt
          </li>
        </Steps>
        <Code>{`Ví dụ — bài "Tổng 2 số":

Dữ liệu nhập:
3
5

Code:
a = int(input())
b = int(input())
print(a + b)

Kết quả: 8`}</Code>
      </DocSection>

      <DocSection number="5" title="Nộp bài và xem điểm">
        <p id="nop-bai">
          Khi bạn tự tin code đúng, bấm <strong>📤 Nộp bài</strong> (nút xanh
          lá).
        </p>
        <p>Hệ thống sẽ:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Chạy code của bạn qua <strong>tất cả</strong> test cases (cả test
            ẩn mà bạn không nhìn thấy)
          </li>
          <li>Tính điểm 0-100 dựa trên số test pass + trọng số</li>
          <li>Lưu lại submission để giáo viên xem được</li>
          <li>Lưu cả thời gian bạn đã làm bài</li>
        </ul>

        <h3 className="mt-3 font-semibold">Hiển thị kết quả</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>🎉 Hoàn hảo!</strong> nếu pass hết — viền xanh, điểm 100/100
          </li>
          <li>
            Không hoàn hảo — viền vàng, hiện điểm thực tế (vd 60/100)
          </li>
          <li>
            <strong>Mỗi test</strong> hiển thị ✅ hoặc ❌. Test ẩn chỉ hiện ✅/❌
            không hiện input/output (để chống đoán đáp án)
          </li>
          <li>
            Test fail (không ẩn) sẽ hiện <strong>Mong đợi vs Bạn in ra</strong>{" "}
            để bạn so sánh và sửa
          </li>
        </ul>

        <Tip>
          Có thể nộp bài <strong>nhiều lần</strong>! Hệ thống lưu cả lịch sử
          và tự nhớ <strong>điểm cao nhất</strong>. Cứ thử-sai-sửa thoải mái.
        </Tip>
      </DocSection>

      <DocSection number="6" title="Hiểu báo lỗi tiếng Việt">
        <p id="bao-loi">
          PyKids tự dịch các lỗi Python phổ biến sang tiếng Việt dễ hiểu:
        </p>

        <h3 className="font-semibold">Các lỗi thường gặp</h3>
        <ul className="ml-5 list-disc space-y-2 text-sm">
          <li>
            <strong>SyntaxError</strong> → "Cú pháp Python sai rồi. Hay quên
            dấu hai chấm <code>:</code> ở cuối <code>if/for/def</code>?"
          </li>
          <li>
            <strong>IndentationError</strong> → "Thụt lề chưa đúng. Đừng trộn
            tab với dấu cách"
          </li>
          <li>
            <strong>NameError</strong> → "Tên X chưa được khai báo. Kiểm tra
            chính tả — Python phân biệt chữ HOA/thường"
          </li>
          <li>
            <strong>TypeError (cộng số với chữ)</strong> → "Sai kiểu dữ liệu.
            Dùng <code>int(x)</code> hoặc <code>str(x)</code> để đổi"
          </li>
          <li>
            <strong>ZeroDivisionError</strong> → "Không thể chia cho 0!"
          </li>
          <li>
            <strong>IndexError</strong> → "Lấy phần tử ngoài danh sách. Index
            bắt đầu từ 0"
          </li>
          <li>
            <strong>RecursionError</strong> → "Hàm gọi chính nó quá nhiều lần.
            Kiểm tra điều kiện dừng"
          </li>
          <li>
            <strong>Timeout 5s</strong> → "Code chạy quá lâu — chắc bạn lỡ
            tạo vòng lặp vô hạn?"
          </li>
        </ul>

        <Tip>
          Hệ thống cũng hiện <strong>chi tiết lỗi gốc tiếng Anh</strong> phía
          dưới — đọc thêm sẽ giúp bạn quen với thuật ngữ thật trong nghề lập
          trình.
        </Tip>
      </DocSection>

      <DocSection number="7" title="Lịch sử nộp bài & điểm cao nhất">
        <p id="lich-su">
          Trong trang làm bài, ở góc trên có badge{" "}
          <strong>📜 Lịch sử nộp</strong>.
        </p>
        <Steps>
          <li>Bấm vào badge → xem mọi lần bạn đã nộp bài này</li>
          <li>
            Mỗi lần hiện: điểm (0-100), số test pass, thời gian làm,
            "vừa xong" / "X phút trước" / ngày cụ thể
          </li>
          <li>
            Bấm <strong>Xem code</strong> để mở rộng coi lại code đã viết lần
            đó
          </li>
        </Steps>
        <p>
          Ở phía trên cùng có 3 ô tóm tắt: <strong>số lần nộp</strong>,{" "}
          <strong>điểm cao nhất</strong>, <strong>tổng thời gian</strong> đã
          làm bài này.
        </p>
        <Tip>
          Hệ thống tự load code lần nộp gần nhất khi bạn vào lại bài tập — đỡ
          phải viết lại từ đầu.
        </Tip>
      </DocSection>

      <DocSection number="8" title="Bảng xếp hạng">
        <p id="xep-hang">
          Trong trang chi tiết lớp, bấm nút <strong>🏆 Xếp hạng</strong> để
          xem ai đang giỏi nhất lớp.
        </p>

        <h3 className="font-semibold">Cách xếp hạng:</h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Tổng điểm</strong> — tổng score cao nhất của mỗi bài bạn
            đã nộp. Càng làm nhiều bài, càng pass nhiều → điểm càng cao
          </li>
          <li>
            Tie-break 1: <strong>Số bài hoàn hảo (100/100)</strong> nhiều hơn
            xếp trên
          </li>
          <li>
            Tie-break 2: <strong>Thời gian làm</strong> ít hơn xếp trên
          </li>
        </ul>

        <p>
          Top 3 có huy chương 🥇🥈🥉. Dòng của <strong>bạn</strong> được
          highlight + có badge "bạn" cho dễ nhận.
        </p>
        <Tip>
          Muốn lên top? Nộp đúng nhiều bài trước, rồi để ý tốc độ. Đừng chỉ
          nộp 1 bài rồi mở tab khác — thời gian vẫn tính!
        </Tip>
      </DocSection>

      <DocSection number="9" title="Mẹo làm bài tốt hơn">
        <p id="meo"></p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Đọc đề 2 lần trước khi code</strong> — hiểu rõ input, output
            yêu cầu gì. Nhiều bài fail vì in dư/thiếu dấu cách, dấu chấm.
          </li>
          <li>
            <strong>Dùng Chạy thử nhiều lần</strong> — đừng vội Nộp bài. Mỗi
            lần Nộp đều bị tính vào lịch sử (nhưng không trừ điểm — chỉ tính
            điểm cao nhất).
          </li>
          <li>
            <strong>Xem ví dụ test public</strong> — bài thường có 1-2 ví dụ
            input/output ở phần đề bài. Code của bạn phải chạy đúng cho ví
            dụ đó.
          </li>
          <li>
            <strong>Test ẩn = bài kiểm tra thật</strong> — đừng hard-code
            đáp án chỉ cho ví dụ public, vì test ẩn sẽ fail và bạn mất điểm.
            Hãy viết logic đúng cho mọi trường hợp.
          </li>
          <li>
            <strong>Chú ý chữ hoa / thường</strong> — <code>Print</code> khác
            <code>print</code>, <code>Tinh_Tong</code> khác <code>tinh_tong</code>
            . Python rất "khó tính" về chuyện này.
          </li>
          <li>
            <strong>Hết ý thì đi pha cốc nước</strong> — khi bí, đứng dậy đi
            ra ngoài, quay lại đọc đề lần nữa, thường sẽ thấy lỗi ngay.
          </li>
          <li>
            <strong>Đổi tên hiển thị</strong> — vào{" "}
            <Link
              href="/profile"
              className="text-indigo-600 hover:underline"
            >
              /profile
            </Link>{" "}
            để đổi tên/lớp. Trên bảng xếp hạng sẽ hiện tên mới.
          </li>
          <li>
            <strong>Còn dư thời gian thì thử Playground</strong> —{" "}
            <Link
              href="/playground"
              className="text-indigo-600 hover:underline"
            >
              /playground
            </Link>{" "}
            cho bạn viết code Python tự do, không tính điểm, không lưu — đỡ
            chán lúc đợi bạn cùng lớp.
          </li>
        </ul>
      </DocSection>

      <Card>
        <div className="flex flex-col gap-2 p-6 text-center text-sm">
          <p>Chúc bạn học tốt! 🐍✨</p>
          <p>
            <Link
              href="/docs/giao-vien"
              className="text-indigo-600 hover:underline"
            >
              Xem hướng dẫn cho Giáo viên →
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
