// Bộ bài tập mẫu theo giáo trình "Lập trình Python 3 Tháng - Cấp 2 - 24 Buổi"
// (slide deck list.pptx). Dùng với seedCurriculum() để import vào 1 lớp.

export type CurriculumTest = {
  type: "stdin_stdout" | "function_check" | "custom_script";
  input: string;
  expectedOutput: string;
  hidden: boolean;
  weight: number;
};

export type CurriculumExercise = {
  session: number; // Buổi học (1-24)
  title: string;
  description: string;
  difficulty: "cap1" | "cap2";
  starterCode: string;
  solutionCode: string;
  tests: CurriculumTest[];
};

export const CURRICULUM_EXERCISES: CurriculumExercise[] = [
  // ===== Buổi 1: Hello World =====
  {
    session: 1,
    title: "Buổi 1 — Hello World",
    description:
      "**Bài đầu tiên!** Hãy viết chương trình in ra dòng chữ:\n\n`Hello, World!`\n\nĐây là chương trình truyền thống của mọi ngôn ngữ lập trình.",
    difficulty: "cap2",
    starterCode: "# Viết code ở đây\n",
    solutionCode: 'print("Hello, World!")\n',
    tests: [
      {
        type: "stdin_stdout",
        input: "",
        expectedOutput: "Hello, World!",
        hidden: false,
        weight: 1,
      },
    ],
  },
  {
    session: 1,
    title: "Buổi 1 — In nhiều dòng",
    description:
      "In ra **3 dòng** sau:\n\n```\nXin chào!\nTôi đang học Python\nThật là vui!\n```",
    difficulty: "cap2",
    starterCode: "",
    solutionCode:
      'print("Xin chào!")\nprint("Tôi đang học Python")\nprint("Thật là vui!")\n',
    tests: [
      {
        type: "stdin_stdout",
        input: "",
        expectedOutput: "Xin chào!\nTôi đang học Python\nThật là vui!",
        hidden: false,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 2: Biến và Kiểu dữ liệu =====
  {
    session: 2,
    title: "Buổi 2 — Khai báo biến và in",
    description:
      "Khai báo 3 biến:\n- `ten = \"Minh\"` (chuỗi)\n- `tuoi = 13` (số nguyên)\n- `chieu_cao = 1.55` (số thực)\n\nIn ra theo định dạng:\n\n```\nTên: Minh\nTuổi: 13\nChiều cao: 1.55\n```",
    difficulty: "cap2",
    starterCode: "# Khai báo biến và in ra\n",
    solutionCode:
      'ten = "Minh"\ntuoi = 13\nchieu_cao = 1.55\nprint(f"Tên: {ten}")\nprint(f"Tuổi: {tuoi}")\nprint(f"Chiều cao: {chieu_cao}")\n',
    tests: [
      {
        type: "stdin_stdout",
        input: "",
        expectedOutput: "Tên: Minh\nTuổi: 13\nChiều cao: 1.55",
        hidden: false,
        weight: 1,
      },
    ],
  },
  {
    session: 2,
    title: "Buổi 2 — Diện tích hình chữ nhật (biến cố định)",
    description:
      "Cho **chiều dài = 8** và **chiều rộng = 5** (gán sẵn trong code).\n\nTính diện tích và in ra: `Diện tích: 40`",
    difficulty: "cap2",
    starterCode: "chieu_dai = 8\nchieu_rong = 5\n# Tính và in diện tích\n",
    solutionCode:
      'chieu_dai = 8\nchieu_rong = 5\ndien_tich = chieu_dai * chieu_rong\nprint(f"Diện tích: {dien_tich}")\n',
    tests: [
      {
        type: "stdin_stdout",
        input: "",
        expectedOutput: "Diện tích: 40",
        hidden: false,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 3: Toán tử =====
  {
    session: 3,
    title: "Buổi 3 — Chu vi và diện tích HCN",
    description:
      "Viết hàm `tinh_hcn(dai, rong)` trả về **tuple** `(chu_vi, dien_tich)`.\n\nVí dụ: `tinh_hcn(5, 3)` trả về `(16, 15)`.",
    difficulty: "cap2",
    starterCode: "def tinh_hcn(dai, rong):\n    pass\n",
    solutionCode:
      "def tinh_hcn(dai, rong):\n    return (2 * (dai + rong), dai * rong)\n",
    tests: [
      {
        type: "function_check",
        input: "assert tinh_hcn(5, 3) == (16, 15)",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert tinh_hcn(10, 10) == (40, 100)",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert tinh_hcn(1, 7) == (16, 7)",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 3,
    title: "Buổi 3 — Đổi đơn vị km sang m",
    description:
      "Viết hàm `km_to_m(km)` đổi từ kilomet sang met.\n\n`km_to_m(2.5)` → `2500.0`",
    difficulty: "cap2",
    starterCode: "def km_to_m(km):\n    pass\n",
    solutionCode: "def km_to_m(km):\n    return km * 1000\n",
    tests: [
      {
        type: "function_check",
        input: "assert km_to_m(1) == 1000",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert km_to_m(2.5) == 2500",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert km_to_m(0) == 0",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 4: Input/Output =====
  {
    session: 4,
    title: "Buổi 4 — Chào hỏi cá nhân",
    description:
      "Nhập tên từ người dùng bằng `input()` rồi in:\n\n```\nXin chào, <tên>!\n```\n\nVí dụ: nhập `Minh` → in `Xin chào, Minh!`",
    difficulty: "cap2",
    starterCode: "ten = input()\n# In lời chào\n",
    solutionCode: 'ten = input()\nprint(f"Xin chào, {ten}!")\n',
    tests: [
      {
        type: "stdin_stdout",
        input: "Minh",
        expectedOutput: "Xin chào, Minh!",
        hidden: false,
        weight: 1,
      },
      {
        type: "stdin_stdout",
        input: "Hùng",
        expectedOutput: "Xin chào, Hùng!",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 4,
    title: "Buổi 4 — Tính tổng 2 số nhập",
    description:
      "Nhập **2 số nguyên** (mỗi dòng 1 số). In ra tổng.\n\nVí dụ: nhập `3` rồi `5` → in `8`",
    difficulty: "cap2",
    starterCode: "a = int(input())\nb = int(input())\n# In tổng\n",
    solutionCode: "a = int(input())\nb = int(input())\nprint(a + b)\n",
    tests: [
      {
        type: "stdin_stdout",
        input: "3\n5",
        expectedOutput: "8",
        hidden: false,
        weight: 1,
      },
      {
        type: "stdin_stdout",
        input: "100\n200",
        expectedOutput: "300",
        hidden: false,
        weight: 1,
      },
      {
        type: "stdin_stdout",
        input: "-5\n5",
        expectedOutput: "0",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 5-6: If-Else =====
  {
    session: 5,
    title: "Buổi 5 — Kiểm tra chẵn lẻ",
    description:
      "Viết hàm `chan_le(n)` trả về chuỗi `\"chẵn\"` nếu n chia hết cho 2, ngược lại trả về `\"lẻ\"`.",
    difficulty: "cap2",
    starterCode: "def chan_le(n):\n    pass\n",
    solutionCode:
      'def chan_le(n):\n    if n % 2 == 0:\n        return "chẵn"\n    return "lẻ"\n',
    tests: [
      {
        type: "function_check",
        input: 'assert chan_le(4) == "chẵn"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert chan_le(7) == "lẻ"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert chan_le(0) == "chẵn"',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert chan_le(-3) == "lẻ"',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 6,
    title: "Buổi 6 — Tìm số lớn nhất trong 3 số",
    description:
      "Viết hàm `max3(a, b, c)` trả về số **lớn nhất** trong 3 số.\n\nKhông được dùng hàm `max()` có sẵn.",
    difficulty: "cap2",
    starterCode: "def max3(a, b, c):\n    pass\n",
    solutionCode:
      "def max3(a, b, c):\n    m = a\n    if b > m:\n        m = b\n    if c > m:\n        m = c\n    return m\n",
    tests: [
      {
        type: "function_check",
        input: "assert max3(1, 2, 3) == 3",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert max3(10, 5, 3) == 10",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert max3(7, 7, 7) == 7",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert max3(-5, -1, -10) == -1",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 6,
    title: "Buổi 6 — Xếp loại học lực",
    description:
      "Viết hàm `xep_loai(diem)` trả về:\n- `\"Giỏi\"` nếu điểm ≥ 8\n- `\"Khá\"` nếu 6.5 ≤ điểm < 8\n- `\"Trung bình\"` nếu 5 ≤ điểm < 6.5\n- `\"Yếu\"` nếu điểm < 5",
    difficulty: "cap2",
    starterCode: "def xep_loai(diem):\n    pass\n",
    solutionCode:
      'def xep_loai(diem):\n    if diem >= 8:\n        return "Giỏi"\n    elif diem >= 6.5:\n        return "Khá"\n    elif diem >= 5:\n        return "Trung bình"\n    else:\n        return "Yếu"\n',
    tests: [
      {
        type: "function_check",
        input: 'assert xep_loai(9) == "Giỏi"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert xep_loai(7) == "Khá"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert xep_loai(5.5) == "Trung bình"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert xep_loai(3) == "Yếu"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert xep_loai(8) == "Giỏi"',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert xep_loai(5) == "Trung bình"',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 7-8: For-While =====
  {
    session: 7,
    title: "Buổi 7 — Tổng từ 1 đến n",
    description:
      "Viết hàm `tong(n)` trả về tổng các số từ 1 đến n.\n\n`tong(5)` → `1+2+3+4+5 = 15`",
    difficulty: "cap2",
    starterCode: "def tong(n):\n    pass\n",
    solutionCode:
      "def tong(n):\n    s = 0\n    for i in range(1, n + 1):\n        s += i\n    return s\n",
    tests: [
      {
        type: "function_check",
        input: "assert tong(5) == 15",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert tong(10) == 55",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert tong(100) == 5050",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert tong(1) == 1",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 7,
    title: "Buổi 7 — Giai thừa",
    description:
      "Viết hàm `giai_thua(n)` trả về **n giai thừa** = `1 × 2 × ... × n`.\n\nQuy ước `giai_thua(0) = 1`.",
    difficulty: "cap2",
    starterCode: "def giai_thua(n):\n    pass\n",
    solutionCode:
      "def giai_thua(n):\n    kq = 1\n    for i in range(2, n + 1):\n        kq *= i\n    return kq\n",
    tests: [
      {
        type: "function_check",
        input: "assert giai_thua(5) == 120",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert giai_thua(0) == 1",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert giai_thua(1) == 1",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert giai_thua(10) == 3628800",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 8,
    title: "Buổi 8 — Bảng cửu chương",
    description:
      "Nhập 1 số nguyên `n` (2 ≤ n ≤ 9). In ra bảng cửu chương của `n`:\n\n```\nn x 1 = ...\nn x 2 = ...\n...\nn x 10 = ...\n```\n\nVí dụ với n=2:\n\n```\n2 x 1 = 2\n2 x 2 = 4\n...\n2 x 10 = 20\n```",
    difficulty: "cap2",
    starterCode: "n = int(input())\n# In bảng cửu chương\n",
    solutionCode:
      'n = int(input())\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")\n',
    tests: [
      {
        type: "stdin_stdout",
        input: "2",
        expectedOutput:
          "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20",
        hidden: false,
        weight: 1,
      },
      {
        type: "stdin_stdout",
        input: "9",
        expectedOutput:
          "9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45\n9 x 6 = 54\n9 x 7 = 63\n9 x 8 = 72\n9 x 9 = 81\n9 x 10 = 90",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 9,
    title: "Buổi 9 — Vẽ tam giác sao",
    description:
      "Nhập `n` (1 ≤ n ≤ 10). Vẽ tam giác sao gồm `n` dòng:\n\n```\n*\n**\n***\n****\n*****\n```\n\n(Ví dụ với n=5)",
    difficulty: "cap2",
    starterCode: "n = int(input())\n# Vẽ tam giác\n",
    solutionCode: 'n = int(input())\nfor i in range(1, n + 1):\n    print("*" * i)\n',
    tests: [
      {
        type: "stdin_stdout",
        input: "5",
        expectedOutput: "*\n**\n***\n****\n*****",
        hidden: false,
        weight: 1,
      },
      {
        type: "stdin_stdout",
        input: "3",
        expectedOutput: "*\n**\n***",
        hidden: false,
        weight: 1,
      },
      {
        type: "stdin_stdout",
        input: "1",
        expectedOutput: "*",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 9,
    title: "Buổi 9 — Đếm chữ số của n",
    description:
      "Viết hàm `dem_chu_so(n)` trả về số chữ số của số nguyên dương `n`.\n\n`dem_chu_so(345)` → `3`",
    difficulty: "cap2",
    starterCode: "def dem_chu_so(n):\n    pass\n",
    solutionCode:
      "def dem_chu_so(n):\n    if n == 0:\n        return 1\n    dem = 0\n    while n > 0:\n        n //= 10\n        dem += 1\n    return dem\n",
    tests: [
      {
        type: "function_check",
        input: "assert dem_chu_so(345) == 3",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert dem_chu_so(7) == 1",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert dem_chu_so(1000000) == 7",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert dem_chu_so(0) == 1",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 10-11: String =====
  {
    session: 10,
    title: "Buổi 10 — Đảo chuỗi",
    description:
      "Viết hàm `dao(s)` trả về chuỗi `s` bị đảo ngược.\n\n`dao(\"Python\")` → `\"nohtyP\"`",
    difficulty: "cap2",
    starterCode: "def dao(s):\n    pass\n",
    solutionCode: "def dao(s):\n    return s[::-1]\n",
    tests: [
      {
        type: "function_check",
        input: 'assert dao("Python") == "nohtyP"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert dao("abc") == "cba"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert dao("") == ""',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert dao("a") == "a"',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 10,
    title: "Buổi 10 — Đếm nguyên âm",
    description:
      "Viết hàm `dem_nguyen_am(s)` đếm số nguyên âm `a, e, i, o, u` (cả hoa và thường) trong chuỗi `s`.\n\n`dem_nguyen_am(\"Python\")` → `1` (chỉ có `o`)",
    difficulty: "cap2",
    starterCode: "def dem_nguyen_am(s):\n    pass\n",
    solutionCode:
      'def dem_nguyen_am(s):\n    dem = 0\n    for c in s.lower():\n        if c in "aeiou":\n            dem += 1\n    return dem\n',
    tests: [
      {
        type: "function_check",
        input: 'assert dem_nguyen_am("Python") == 1',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert dem_nguyen_am("Hello World") == 3',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert dem_nguyen_am("AEIOU") == 5',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert dem_nguyen_am("xyz") == 0',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 11,
    title: "Buổi 11 — Palindrome",
    description:
      "Viết hàm `la_palindrome(s)` trả về `True` nếu `s` đọc xuôi/ngược giống nhau, ngược lại `False`. Chuỗi rỗng tính là palindrome.\n\nVí dụ: `\"abba\"` → True, `\"abc\"` → False.",
    difficulty: "cap2",
    starterCode: "def la_palindrome(s):\n    pass\n",
    solutionCode: "def la_palindrome(s):\n    return s == s[::-1]\n",
    tests: [
      {
        type: "function_check",
        input: 'assert la_palindrome("abba") == True',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert la_palindrome("abc") == False',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert la_palindrome("a") == True',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert la_palindrome("") == True',
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 12-13: List =====
  {
    session: 12,
    title: "Buổi 12 — Max/Min trong list",
    description:
      "Viết hàm `max_min(lst)` trả về tuple `(max, min)` của list `lst` (đảm bảo `lst` không rỗng).\n\nKhông dùng `max()` / `min()` có sẵn.",
    difficulty: "cap2",
    starterCode: "def max_min(lst):\n    pass\n",
    solutionCode:
      "def max_min(lst):\n    mx = mn = lst[0]\n    for x in lst[1:]:\n        if x > mx: mx = x\n        if x < mn: mn = x\n    return (mx, mn)\n",
    tests: [
      {
        type: "function_check",
        input: "assert max_min([3, 1, 4, 1, 5]) == (5, 1)",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert max_min([-2, -5, -1]) == (-1, -5)",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert max_min([7]) == (7, 7)",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 12,
    title: "Buổi 12 — Trung bình cộng",
    description:
      "Viết hàm `trung_binh(lst)` trả về trung bình cộng của list `lst` (kiểu float).\n\n`trung_binh([1, 2, 3, 4, 5])` → `3.0`",
    difficulty: "cap2",
    starterCode: "def trung_binh(lst):\n    pass\n",
    solutionCode:
      "def trung_binh(lst):\n    return sum(lst) / len(lst)\n",
    tests: [
      {
        type: "function_check",
        input: "assert trung_binh([1, 2, 3, 4, 5]) == 3.0",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert trung_binh([10, 20]) == 15.0",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert trung_binh([7]) == 7.0",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 13,
    title: "Buổi 13 — Đếm số chẵn trong list",
    description:
      "Viết hàm `dem_chan(lst)` trả về số phần tử **chẵn** trong list `lst`.",
    difficulty: "cap2",
    starterCode: "def dem_chan(lst):\n    pass\n",
    solutionCode:
      "def dem_chan(lst):\n    return sum(1 for x in lst if x % 2 == 0)\n",
    tests: [
      {
        type: "function_check",
        input: "assert dem_chan([1, 2, 3, 4, 5]) == 2",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert dem_chan([2, 4, 6, 8]) == 4",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert dem_chan([1, 3, 5]) == 0",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert dem_chan([]) == 0",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 13,
    title: "Buổi 13 — Sắp xếp tăng dần",
    description:
      "Viết hàm `sap_xep(lst)` trả về **list mới** đã sắp xếp tăng dần (không thay đổi list gốc).",
    difficulty: "cap2",
    starterCode: "def sap_xep(lst):\n    pass\n",
    solutionCode: "def sap_xep(lst):\n    return sorted(lst)\n",
    tests: [
      {
        type: "function_check",
        input: "assert sap_xep([3, 1, 4, 1, 5]) == [1, 1, 3, 4, 5]",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input:
          "lst = [5, 2, 1]\n_kq = sap_xep(lst)\nassert _kq == [1, 2, 5]\nassert lst == [5, 2, 1]  # không đổi list gốc",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 14: Tuple & Set =====
  {
    session: 14,
    title: "Buổi 14 — Loại bỏ trùng lặp",
    description:
      "Viết hàm `loai_trung(lst)` trả về list mới, **giữ thứ tự xuất hiện đầu tiên** của mỗi phần tử, loại bỏ trùng lặp.\n\n`loai_trung([1, 2, 1, 3, 2, 4])` → `[1, 2, 3, 4]`",
    difficulty: "cap2",
    starterCode: "def loai_trung(lst):\n    pass\n",
    solutionCode:
      "def loai_trung(lst):\n    seen = set()\n    kq = []\n    for x in lst:\n        if x not in seen:\n            seen.add(x)\n            kq.append(x)\n    return kq\n",
    tests: [
      {
        type: "function_check",
        input: "assert loai_trung([1, 2, 1, 3, 2, 4]) == [1, 2, 3, 4]",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert loai_trung(["a", "b", "a"]) == ["a", "b"]',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert loai_trung([]) == []",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 15: Dictionary =====
  {
    session: 15,
    title: "Buổi 15 — Đếm tần suất ký tự",
    description:
      "Viết hàm `tan_suat(s)` trả về **dictionary** với key là ký tự trong `s`, value là số lần xuất hiện.\n\n`tan_suat(\"abca\")` → `{'a': 2, 'b': 1, 'c': 1}`",
    difficulty: "cap2",
    starterCode: "def tan_suat(s):\n    pass\n",
    solutionCode:
      "def tan_suat(s):\n    d = {}\n    for c in s:\n        d[c] = d.get(c, 0) + 1\n    return d\n",
    tests: [
      {
        type: "function_check",
        input: "assert tan_suat(\"abca\") == {'a': 2, 'b': 1, 'c': 1}",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert tan_suat("aaaa") == {"a": 4}',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert tan_suat(\"\") == {}",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 16: Ôn tập (mini project) =====
  {
    session: 16,
    title: "Buổi 16 — Quản lý điểm học sinh",
    description:
      "Cho **dictionary** `diem` với key là tên học sinh, value là điểm. Viết hàm `xep_hang(diem)` trả về **list các tên** đã sắp xếp theo điểm **giảm dần** (điểm cao trước).\n\nVí dụ:\n```python\n{'A': 8, 'B': 9, 'C': 7}\n```\n→ `['B', 'A', 'C']`",
    difficulty: "cap2",
    starterCode: "def xep_hang(diem):\n    pass\n",
    solutionCode:
      "def xep_hang(diem):\n    return sorted(diem.keys(), key=lambda t: diem[t], reverse=True)\n",
    tests: [
      {
        type: "function_check",
        input:
          "assert xep_hang({'A': 8, 'B': 9, 'C': 7}) == ['B', 'A', 'C']",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert xep_hang({'X': 10}) == ['X']",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },

  // ===== Buổi 17-18: Function =====
  {
    session: 17,
    title: "Buổi 17 — Tham số mặc định",
    description:
      "Viết hàm `chao(ten, loi_chao=\"Xin chào\")` trả về chuỗi `\"<lời chào>, <tên>!\"`.\n\nVí dụ:\n- `chao(\"Minh\")` → `\"Xin chào, Minh!\"`\n- `chao(\"Hùng\", \"Hi\")` → `\"Hi, Hùng!\"`",
    difficulty: "cap2",
    starterCode: 'def chao(ten, loi_chao="Xin chào"):\n    pass\n',
    solutionCode:
      'def chao(ten, loi_chao="Xin chào"):\n    return f"{loi_chao}, {ten}!"\n',
    tests: [
      {
        type: "function_check",
        input: 'assert chao("Minh") == "Xin chào, Minh!"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: 'assert chao("Hùng", "Hi") == "Hi, Hùng!"',
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
    ],
  },
  {
    session: 18,
    title: "Buổi 18 — Số nguyên tố",
    description:
      "Viết hàm `la_nguyen_to(n)` trả về `True` nếu `n` là số nguyên tố, ngược lại `False`.\n\nSố nguyên tố là số tự nhiên ≥ 2, chỉ chia hết cho 1 và chính nó.",
    difficulty: "cap2",
    starterCode: "def la_nguyen_to(n):\n    pass\n",
    solutionCode:
      "def la_nguyen_to(n):\n    if n < 2:\n        return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            return False\n        i += 1\n    return True\n",
    tests: [
      {
        type: "function_check",
        input: "assert la_nguyen_to(7) == True",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert la_nguyen_to(10) == False",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert la_nguyen_to(2) == True",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert la_nguyen_to(1) == False",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert la_nguyen_to(97) == True",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
  {
    session: 18,
    title: "Buổi 18 — Dãy Fibonacci",
    description:
      "Viết hàm `fib(n)` trả về phần tử thứ `n` của dãy Fibonacci.\n\nQuy ước: `fib(0) = 0`, `fib(1) = 1`, `fib(n) = fib(n-1) + fib(n-2)`.",
    difficulty: "cap2",
    starterCode: "def fib(n):\n    pass\n",
    solutionCode:
      "def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n",
    tests: [
      {
        type: "function_check",
        input: "assert fib(0) == 0",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert fib(1) == 1",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert fib(10) == 55",
        expectedOutput: "",
        hidden: false,
        weight: 1,
      },
      {
        type: "function_check",
        input: "assert fib(20) == 6765",
        expectedOutput: "",
        hidden: true,
        weight: 1,
      },
    ],
  },
];
