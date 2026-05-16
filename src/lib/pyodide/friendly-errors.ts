type ErrorPattern = {
  match: RegExp;
  hint: (m: RegExpMatchArray) => string;
};

const PATTERNS: ErrorPattern[] = [
  {
    match: /SyntaxError: invalid syntax/i,
    hint: () =>
      "Cú pháp Python sai rồi. Hay quên dấu hai chấm `:` ở cuối dòng `if`/`for`/`def`? Hoặc thiếu dấu ngoặc?",
  },
  {
    match: /SyntaxError: unexpected EOF/i,
    hint: () =>
      "Có dòng nào chưa hoàn tất — chắc bạn quên đóng ngoặc `)`, `]`, `}` hoặc chưa viết xong câu lệnh.",
  },
  {
    match: /IndentationError|TabError/i,
    hint: () =>
      "Thụt lề (indent) chưa đúng. Trong Python, các dòng cùng khối phải thụt vào cùng số dấu cách. Đừng trộn tab với dấu cách.",
  },
  {
    match: /NameError: name '([^']+)' is not defined/i,
    hint: (m) =>
      `Tên \`${m[1]}\` chưa được khai báo. Bạn lỡ viết sai chính tả tên biến/hàm? Python phân biệt chữ hoa/chữ thường nhé.`,
  },
  {
    match: /TypeError: unsupported operand type/i,
    hint: () =>
      "Sai kiểu dữ liệu rồi. Có thể bạn đang cộng số (`int`) với chữ (`str`). Dùng `int(x)` hoặc `str(x)` để đổi kiểu.",
  },
  {
    match: /TypeError: '([^']+)' object is not callable/i,
    hint: (m) =>
      `\`${m[1]}\` không phải hàm để gọi được. Bạn có lỡ đặt tên biến trùng với tên hàm không?`,
  },
  {
    match:
      /TypeError: ([^ ]+) takes (\d+) positional argument[s]? but (\d+) were given/i,
    hint: (m) =>
      `Hàm \`${m[1]}\` cần ${m[2]} tham số, nhưng bạn truyền ${m[3]} cái. Đếm lại số tham số nhé.`,
  },
  {
    match: /ZeroDivisionError/i,
    hint: () => "Không thể chia cho 0! Kiểm tra mẫu số trước khi chia.",
  },
  {
    match: /IndexError: list index out of range/i,
    hint: () =>
      "Đang lấy phần tử ngoài danh sách. Nhớ rằng index Python bắt đầu từ 0, và phần tử cuối là `len(list) - 1`.",
  },
  {
    match: /KeyError: '?([^'\n]+)'?/i,
    hint: (m) =>
      `Dictionary không có key \`${m[1]}\`. Kiểm tra chính tả hoặc dùng \`dict.get(key)\` để tránh lỗi.`,
  },
  {
    match: /ValueError: invalid literal for int/i,
    hint: () =>
      "Không thể đổi chuỗi này thành số bằng `int()`. Kiểm tra dữ liệu nhập có thực sự là số không.",
  },
  {
    match: /EOFError/i,
    hint: () =>
      "Hết dữ liệu nhập rồi. Bạn gọi `input()` nhiều lần hơn số dòng input có sẵn.",
  },
  {
    match: /RecursionError/i,
    hint: () =>
      "Hàm gọi chính nó quá nhiều lần (quá ~1000). Kiểm tra điều kiện dừng đệ quy.",
  },
  {
    match: /AttributeError: '([^']+)' object has no attribute '([^']+)'/i,
    hint: (m) =>
      `Đối tượng kiểu \`${m[1]}\` không có thuộc tính/phương thức \`${m[2]}\`. Có thể bạn gõ sai tên?`,
  },
  {
    match: /Hết thời gian chạy/i,
    hint: () =>
      "Code chạy quá lâu (5s). Bạn có lỡ viết vòng lặp vô hạn không? Kiểm tra điều kiện dừng `while`.",
  },
];

export function friendlyError(raw: string | null): string | null {
  if (!raw) return null;
  for (const p of PATTERNS) {
    const m = raw.match(p.match);
    if (m) return p.hint(m);
  }
  return null;
}
