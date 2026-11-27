import { StudentRecord } from '../types/game';

export const STORAGE_KEY = 'bui_duc_manh_hdt_records_v1';
export const WEBHOOK_KEY = 'bui_duc_manh_hdt_webhook_v1';

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getStudentRecords(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentRecord[]) : [];
  } catch {
    return [];
  }
}

export function getSortedRecords(): StudentRecord[] {
  const records = getStudentRecords();
  return [...records].sort((a, b) => {
    if (b.correct !== a.correct) {
      return b.correct - a.correct;
    }
    const durA = typeof a.durationSec === 'number' ? a.durationSec : 999999;
    const durB = typeof b.durationSec === 'number' ? b.durationSec : 999999;
    return durA - durB;
  });
}

export function saveStudentRecord(record: StudentRecord): StudentRecord[] {
  const records = getStudentRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records;
}

export function clearAllStudentRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getWebhookUrl(): string {
  try {
    return localStorage.getItem(WEBHOOK_KEY) || '';
  } catch {
    return '';
  }
}

export function setWebhookUrl(url: string): void {
  localStorage.setItem(WEBHOOK_KEY, url.trim());
}

export function buildZaloReport(sorted: StudentRecord[]): string {
  const today = new Date().toLocaleDateString('vi-VN');
  let report = `🏆 BẢNG VÀNG ÔN TẬP 7 HẰNG ĐẲNG THỨC (TOÁN 8) 🏆\n`;
  report += `👨‍🏫 Giáo viên hướng dẫn: Thầy Bùi Đức Mạnh\n`;
  report += `📅 Ngày: ${today} | Sĩ số tham gia: ${sorted.length} em\n`;
  report += `----------------------------------------\n`;

  sorted.forEach((r, idx) => {
    const medal =
      idx === 0 ? '🥇 Hạng 1:' : idx === 1 ? '🥈 Hạng 2:' : idx === 2 ? '🥉 Hạng 3:' : `${idx + 1}.`;
    report += `${medal} ${r.name} (${r.className}) — Đúng ${r.correctText} câu (Thời gian: ${r.durationText || '--:--'})\n`;
  });

  report += `----------------------------------------\n`;
  report += `👏 Thầy khen ngợi tinh thần học tập của các em! Phụ huynh cùng động viên các con ôn bài nhé!`;
  return report;
}

export function buildGoogleSheetTSV(sorted: StudentRecord[]): string {
  const headers = [
    'Hạng',
    'Họ và tên',
    'Lớp',
    'Số câu đúng',
    'Thời gian làm bài',
    'Điểm số',
    'Nhận biết',
    'Thông hiểu',
    'Vận dụng',
    'Thời điểm nộp',
  ];
  const lines = sorted.map((r, i) =>
    [
      i + 1,
      r.name,
      r.className,
      r.correctText,
      r.durationText || '--:--',
      r.score,
      r.nb,
      r.th,
      r.vd,
      r.time,
    ].join('\t')
  );
  return [headers.join('\t'), ...lines].join('\n');
}

export function downloadRecordsCSV(sorted: StudentRecord[]): void {
  const headers = [
    'Hạng',
    'Họ và tên học sinh',
    'Lớp',
    'Số câu đúng',
    'Thời gian làm bài',
    'Điểm số',
    'Nhận biết',
    'Thông hiểu',
    'Vận dụng',
    'Thời điểm nộp',
    'Giáo viên hướng dẫn',
  ];
  const rows = sorted.map((r, i) => [
    i + 1,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.className.replace(/"/g, '""')}"`,
    `"${r.correctText}"`,
    `"${r.durationText || '--:--'}"`,
    r.score,
    `"${r.nb}"`,
    `"${r.th}"`,
    `"${r.vd}"`,
    `"${r.time}"`,
    `"Thầy Bùi Đức Mạnh"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateTag = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Bang_Xep_Hang_7_Hang_Dang_Thuc_${dateTag}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }
  try {
    const tempArea = document.createElement('textarea');
    tempArea.value = text;
    tempArea.style.position = 'fixed';
    tempArea.style.opacity = '0';
    document.body.appendChild(tempArea);
    tempArea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(tempArea);
    return ok;
  } catch {
    return false;
  }
}
