import { ActiveQuestion, RawQuestion } from '../types/game';

export const RAW_QUESTIONS: RawQuestion[] = [
  // 10 CÂU NHẬN BIẾT (Công thức chiều xuôi & chiều ngược)
  {
    id: 1,
    level: 'Nhận biết',
    prompt: 'Khai triển hằng đẳng thức bình phương của một tổng: [[(A + B)^2]] bằng:',
    options: [
      'A^2 + 2AB + B^2',
      'A^2 + AB + B^2',
      'A^2 - 2AB + B^2',
      'A^2 + 2AB - B^2',
    ],
    correct: 0,
    hintTitle: 'Hằng đẳng thức số 1: Bình phương của một tổng',
    hintDetail: 'Gồm bình phương số thứ nhất, cộng hai lần tích hai số, cộng bình phương số thứ hai.',
    explain:
      'Bình phương của một tổng bằng bình phương số thứ nhất cộng hai lần tích hai số cộng bình phương số thứ hai: (A + B)² = A² + 2AB + B².',
  },
  {
    id: 2,
    level: 'Nhận biết',
    prompt: 'Khai triển hằng đẳng thức bình phương của một hiệu: [[(A - B)^2]] bằng:',
    options: [
      'A^2 - 2AB + B^2',
      'A^2 - 2AB - B^2',
      'A^2 - AB + B^2',
      'A^2 + 2AB + B^2',
    ],
    correct: 0,
    hintTitle: 'Hằng đẳng thức số 2: Bình phương của một hiệu',
    hintDetail: 'Chú ý dấu của số hạng ở giữa là (-), còn bình phương số thứ hai luôn là (+).',
    explain: 'Chú ý dấu trừ ở tích hai lần: (A - B)² = A² - 2AB + B².',
  },
  {
    id: 3,
    level: 'Nhận biết',
    prompt: 'Hiệu hai bình phương [[A^2 - B^2]] được viết dưới dạng tích là:',
    options: [
      '(A - B)(A + B)',
      '(A - B)^2',
      '(A + B)^2',
      '(A - B)(A^2 + AB + B^2)',
    ],
    correct: 0,
    hintTitle: 'Hằng đẳng thức số 3: Hiệu hai bình phương',
    hintDetail: 'Bằng tích của hiệu hai biểu thức nhân với tổng hai biểu thức.',
    explain:
      'Hiệu hai bình phương bằng tích của hiệu hai biểu thức với tổng hai biểu thức: A² - B² = (A - B)(A + B).',
  },
  {
    id: 4,
    level: 'Nhận biết',
    prompt: 'Khai triển lập phương của một tổng [[(A + B)^3]] là:',
    options: [
      'A^3 + 3A^2B + 3AB^2 + B^3',
      'A^3 + A^2B + AB^2 + B^3',
      'A^3 - 3A^2B + 3AB^2 - B^3',
      '(A + B)(A^2 - AB + B^2)',
    ],
    correct: 0,
    hintTitle: 'Hằng đẳng thức số 4: Lập phương của một tổng',
    hintDetail: 'Hệ số các số hạng lần lượt là 1, 3, 3, 1 và toàn bộ là dấu (+).',
    explain:
      'Lập phương của một tổng có hệ số 1 - 3 - 3 - 1 và toàn dấu cộng: A³ + 3A²B + 3AB² + B³.',
  },
  {
    id: 5,
    level: 'Nhận biết',
    prompt: 'Khai triển lập phương của một hiệu [[(A - B)^3]] là:',
    options: [
      'A^3 - 3A^2B + 3AB^2 - B^3',
      'A^3 - 3A^2B - 3AB^2 - B^3',
      'A^3 + 3A^2B - 3AB^2 - B^3',
      '(A - B)(A^2 + AB + B^2)',
    ],
    correct: 0,
    hintTitle: 'Hằng đẳng thức số 5: Lập phương của một hiệu',
    hintDetail: 'Hệ số 1 - 3 - 3 - 1 với dấu đan xen (+, -, +, -).',
    explain:
      'Lập phương của một hiệu có dấu đan xen (+, -, +, -): A³ - 3A²B + 3AB² - B³.',
  },
  {
    id: 6,
    level: 'Nhận biết',
    prompt: 'Tổng hai lập phương [[A^3 + B^3]] bằng:',
    options: [
      '(A + B)(A^2 - AB + B^2)',
      '(A + B)(A^2 + AB + B^2)',
      '(A - B)(A^2 + AB + B^2)',
      '(A + B)(A^2 - 2AB + B^2)',
    ],
    correct: 0,
    hintTitle: 'Hằng đẳng thức số 6: Tổng hai lập phương',
    hintDetail: 'Ngoặc đầu giữ nguyên dấu (+), ngoặc sau là bình phương thiếu của một hiệu (không có số 2 ở AB).',
    explain:
      'Tổng hai lập phương giữ nguyên dấu (+) ở ngoặc đầu và đổi thành dấu (-) ở bình phương thiếu: (A + B)(A² - AB + B²).',
  },
  {
    id: 7,
    level: 'Nhận biết',
    prompt: 'Hiệu hai lập phương [[A^3 - B^3]] bằng:',
    options: [
      '(A - B)(A^2 + AB + B^2)',
      '(A - B)(A^2 - AB + B^2)',
      '(A + B)(A^2 - AB + B^2)',
      '(A - B)(A^2 + 2AB + B^2)',
    ],
    correct: 0,
    hintTitle: 'Hằng đẳng thức số 7: Hiệu hai lập phương',
    hintDetail: 'Ngoặc đầu giữ dấu (-), ngoặc sau là bình phương thiếu của một tổng (không có số 2 ở AB).',
    explain:
      'Hiệu hai lập phương giữ nguyên dấu (-) ở ngoặc đầu và toàn dấu (+) ở ngoặc sau: (A - B)(A² + AB + B²).',
  },
  {
    id: 8,
    level: 'Nhận biết',
    prompt: 'Viết biểu thức [[x^2 + 2xy + y^2]] dưới dạng bình phương của một tổng (chiều ngược):',
    options: ['(x + y)^2', '(x - y)^2', 'x^2 + y^2', '(x + y)(x - y)'],
    correct: 0,
    hintTitle: 'Chiều ngược hằng đẳng thức số 1',
    hintDetail: 'Nhận diện dạng A² + 2AB + B² với A = x và B = y.',
    explain: 'Áp dụng chiều ngược của hằng đẳng thức số 1: x² + 2xy + y² = (x + y)².',
  },
  {
    id: 9,
    level: 'Nhận biết',
    prompt: 'Biểu thức [[(x - y)(x + y)]] viết gọn lại (chiều ngược) là:',
    options: ['x^2 - y^2', 'x^2 + y^2', '(x - y)^2', '(x + y)^2'],
    correct: 0,
    hintTitle: 'Chiều ngược hằng đẳng thức số 3',
    hintDetail: 'Tích của một hiệu và một tổng (A - B)(A + B) viết gọn thành hiệu hai bình phương.',
    explain: 'Tích của hiệu và tổng hai số bằng hiệu hai bình phương: (x - y)(x + y) = x² - y².',
  },
  {
    id: 10,
    level: 'Nhận biết',
    prompt: 'Biểu thức [[x^3 - 3x^2y + 3xy^2 - y^3]] viết gọn (chiều ngược) là:',
    options: ['(x - y)^3', '(x + y)^3', 'x^3 - y^3', 'x^3 + y^3'],
    correct: 0,
    hintTitle: 'Chiều ngược hằng đẳng thức số 5',
    hintDetail: 'Quan sát 4 hạng tử bậc 3 với hệ số 1, 3, 3, 1 và dấu đan xen (+, -, +, -).',
    explain: 'Dấu đan xen (+, -, +, -) chính là khai triển của lập phương một hiệu (x - y)³.',
  },

  // 6 CÂU THÔNG HIỂU (Biến cơ bản x)
  {
    id: 11,
    level: 'Thông hiểu',
    prompt: 'Khai triển biểu thức [[(x + 1)^2]] ta được kết quả nào?',
    options: ['x^2 + 2x + 1', 'x^2 + x + 1', 'x^2 + 2x + 2', 'x^2 + 1'],
    correct: 0,
    hintTitle: 'Áp dụng (A + B)² với A = x, B = 1',
    hintDetail: 'Nhớ tính đủ số hạng ở giữa: 2 · A · B = 2 · x · 1.',
    explain: '(x + 1)² = x² + 2·x·1 + 1² = x² + 2x + 1.',
  },
  {
    id: 12,
    level: 'Thông hiểu',
    prompt: 'Khai triển biểu thức [[(x - 3)^2]] ta được kết quả nào?',
    options: ['x^2 - 6x + 9', 'x^2 - 3x + 9', 'x^2 - 6x - 9', 'x^2 - 9'],
    correct: 0,
    hintTitle: 'Áp dụng (A - B)² với A = x, B = 3',
    hintDetail: 'Số hạng ở giữa là -2 · x · 3 và số hạng cuối là +3².',
    explain: '(x - 3)² = x² - 2·x·3 + 3² = x² - 6x + 9.',
  },
  {
    id: 13,
    level: 'Thông hiểu',
    prompt: 'Phân tích đa thức [[x^2 - 16]] thành nhân tử (chiều ngược) ta được:',
    options: ['(x - 4)(x + 4)', '(x - 8)(x + 8)', '(x - 4)^2', '(x - 16)(x + 16)'],
    correct: 0,
    hintTitle: 'Áp dụng chiều ngược A² - B²',
    hintDetail: 'Viết 16 dưới dạng bình phương của một số tự nhiên: 16 = 4².',
    explain: 'Vì 16 = 4² nên x² - 16 = x² - 4² = (x - 4)(x + 4).',
  },
  {
    id: 14,
    level: 'Thông hiểu',
    prompt: 'Khai triển biểu thức [[(x + 1)^3]] ta được kết quả nào?',
    options: [
      'x^3 + 3x^2 + 3x + 1',
      'x^3 + x^2 + x + 1',
      'x^3 + 3x^2 + 3x + 3',
      'x^3 + 1',
    ],
    correct: 0,
    hintTitle: 'Áp dụng (A + B)³ với A = x, B = 1',
    hintDetail: 'Thay A = x, B = 1 vào A³ + 3A²B + 3AB² + B³, chú ý 1³ = 1.',
    explain: '(x + 1)³ = x³ + 3·x²·1 + 3·x·1² + 1³ = x³ + 3x² + 3x + 1.',
  },
  {
    id: 15,
    level: 'Thông hiểu',
    prompt: 'Viết biểu thức [[x^3 + 8]] dưới dạng tích (chiều ngược) ta được:',
    options: [
      '(x + 2)(x^2 - 2x + 4)',
      '(x + 2)(x^2 + 2x + 4)',
      '(x - 2)(x^2 + 2x + 4)',
      '(x + 2)^3',
    ],
    correct: 0,
    hintTitle: 'Áp dụng tổng hai lập phương A³ + B³',
    hintDetail: 'Viết 8 = 2³, suy ra A = x và B = 2. Ngoặc sau nhớ có dấu (-) ở tích AB.',
    explain: 'Vì 8 = 2³ nên x³ + 8 = x³ + 2³ = (x + 2)(x² - 2x + 4).',
  },
  {
    id: 16,
    level: 'Thông hiểu',
    prompt: 'Viết biểu thức [[x^2 - 10x + 25]] dưới dạng bình phương của một hiệu:',
    options: ['(x - 5)^2', '(x + 5)^2', '(x - 25)^2', '(x - 5)(x + 5)'],
    correct: 0,
    hintTitle: 'Chiều ngược bình phương của một hiệu',
    hintDetail: 'Phân tích 10x = 2 · x · 5 và 25 = 5².',
    explain: 'Ta có x² - 10x + 25 = x² - 2·x·5 + 5² = (x - 5)².',
  },

  // 4 CÂU VẬN DỤNG (Dạng rút gọn biểu thức có hệ số 2x)
  {
    id: 17,
    level: 'Vận dụng',
    prompt: 'Rút gọn biểu thức: [[A = (2x + 1)^2 - 4x^2]]',
    options: ['4x + 1', '2x + 1', '8x^2 + 4x + 1', '4x - 1'],
    correct: 0,
    hintTitle: 'Khai triển (2x + 1)² rồi rút gọn hạng tử đồng dạng',
    hintDetail: 'Chú ý (2x)² = 4x² và số hạng giữa là 2 · 2x · 1 = 4x.',
    explain:
      'Bước 1: Khai triển (2x + 1)² = (2x)² + 2·2x·1 + 1² = 4x² + 4x + 1. Bước 2: A = (4x² + 4x + 1) - 4x² = 4x + 1.',
  },
  {
    id: 18,
    level: 'Vận dụng',
    prompt: 'Rút gọn biểu thức: [[B = (2x - 3)(2x + 3) - 4x^2]]',
    options: ['-9', '9', '-6', '8x^2 - 9'],
    correct: 0,
    hintTitle: 'Nhận diện hiệu hai bình phương ở tích đầu',
    hintDetail: '(2x - 3)(2x + 3) = (2x)² - 3² = 4x² - 9.',
    explain:
      'Bước 1: Áp dụng hiệu hai bình phương (2x - 3)(2x + 3) = (2x)² - 3² = 4x² - 9. Bước 2: B = 4x² - 9 - 4x² = -9.',
  },
  {
    id: 19,
    level: 'Vận dụng',
    prompt: 'Rút gọn biểu thức: [[C = (2x + 1)^2 + (2x - 1)^2 - 8x^2]]',
    options: ['2', '0', '8x + 2', '-2'],
    correct: 0,
    hintTitle: 'Khai triển từng bình phương rồi cộng lại',
    hintDetail: '(2x + 1)² = 4x² + 4x + 1 và (2x - 1)² = 4x² - 4x + 1. Chú ý +4x và -4x triệt tiêu nhau.',
    explain:
      'Ta có (2x + 1)² = 4x² + 4x + 1 và (2x - 1)² = 4x² - 4x + 1. Cộng lại được 8x² + 2, trừ đi 8x² còn lại 2.',
  },
  {
    id: 20,
    level: 'Vận dụng',
    prompt: 'Rút gọn biểu thức: [[D = (2x + 3)^2 - (2x - 3)^2]]',
    options: ['24x', '12x', '18', '8x^2 + 18'],
    correct: 0,
    hintTitle: 'Khai triển hai bình phương hoặc dùng hiệu hai bình phương',
    hintDetail: 'Khi bỏ dấu ngoặc có dấu (-) phía trước, nhớ đổi dấu tất cả số hạng bên trong: -(4x² - 12x + 9).',
    explain:
      '(2x + 3)² = 4x² + 12x + 9; (2x - 3)² = 4x² - 12x + 9. Lấy biểu thức trước trừ biểu thức sau: (4x² + 12x + 9) - (4x² - 12x + 9) = 24x.',
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function prepareShuffledQuestions(): ActiveQuestion[] {
  return RAW_QUESTIONS.map((item) => {
    const indexed = item.options.map((text, idx) => ({
      text,
      isCorrect: idx === item.correct,
    }));
    const shuffled = shuffleArray(indexed);
    return {
      id: item.id,
      level: item.level,
      prompt: item.prompt,
      options: shuffled.map((o) => o.text),
      correctIndex: shuffled.findIndex((o) => o.isCorrect),
      hintTitle: item.hintTitle,
      hintDetail: item.hintDetail,
      explain: item.explain,
    };
  });
}
