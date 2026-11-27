import React, { useEffect, useState } from 'react';
import {
  X,
  Trophy,
  Trash2,
  Share2,
  Copy,
  FileDown,
  Play,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { StudentRecord } from '../types/game';
import {
  buildGoogleSheetTSV,
  buildZaloReport,
  copyToClipboard,
  downloadRecordsCSV,
  getWebhookUrl,
  setWebhookUrl,
} from '../utils/storage';

/* ============================================================================
   1. PAUSE MODAL
   ============================================================================ */
interface PauseModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExitToTitle: () => void;
  onToggleSound: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  soundEnabled,
  onResume,
  onRestart,
  onExitToTitle,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#FAF9F5] text-slate-900 rounded-2xl p-6 shadow-2xl border border-amber-200 animate-pop-in space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-extrabold text-slate-900">Tạm dừng trò chơi</h3>
          <button
            type="button"
            onClick={onResume}
            aria-label="Đóng"
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-display font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Tiếp tục làm bài</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>{soundEnabled ? 'Âm thanh: Đang bật' : 'Âm thanh: Đang tắt'}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại từ câu 1</span>
          </button>

          <button
            type="button"
            onClick={onExitToTitle}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Về màn hình chính</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. LEADERBOARD & EXPORT MODAL
   ============================================================================ */
interface LeaderboardModalProps {
  isOpen: boolean;
  records: StudentRecord[];
  onClose: () => void;
  onClearAll: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  records,
  onClose,
  onClearAll,
}) => {
  const [toast, setToast] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setToast(null);
      setConfirmClear(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 3500);
    return () => clearTimeout(t);
  }, [confirmClear]);

  if (!isOpen) return null;

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleCopyZalo = async () => {
    if (records.length === 0) {
      notify('Chưa có dữ liệu học sinh để tạo báo cáo.');
      return;
    }
    const ok = await copyToClipboard(buildZaloReport(records));
    if (ok) {
      notify('Đã copy Bảng Vàng! Thầy mở nhóm Zalo Phụ huynh và dán (Ctrl+V) để gửi ngay.');
    }
  };

  const handleCopySheet = async () => {
    if (records.length === 0) {
      notify('Danh sách đang trống.');
      return;
    }
    const ok = await copyToClipboard(buildGoogleSheetTSV(records));
    if (ok) {
      notify('Đã copy bảng! Thầy mở Google Sheet và bấm Ctrl+V là tự động chia cột.');
    }
  };

  const handleDownloadCSV = () => {
    if (records.length === 0) {
      notify('Danh sách đang trống, chưa có dữ liệu để xuất.');
      return;
    }
    downloadRecordsCSV(records);
    notify('Đã tải file CSV! Thầy có thể nhập trực tiếp file này vào Google Sheet hoặc Excel.');
  };

  const handleClear = () => {
    if (records.length === 0) return;
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    onClearAll();
    setConfirmClear(false);
    notify('Đã xóa sạch danh sách học sinh.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FAF9F5] text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col p-5 sm:p-6 border border-amber-200 animate-pop-in">
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-display text-lg sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-600 shrink-0" />
              <span>Bảng Xếp Hạng &amp; Danh Sách Học Sinh</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Xếp theo số câu đúng nhiều nhất → thời gian hoàn thành sớm nhất · Thầy Bùi Đức Mạnh
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng xếp hạng"
            className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {toast && (
          <div className="mt-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-xs sm:text-sm text-center">
            {toast}
          </div>
        )}

        <div className="flex-1 overflow-auto border border-slate-200 rounded-xl my-3 bg-white">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
              <tr>
                <th className="p-3 border-b text-center w-16">Hạng</th>
                <th className="p-3 border-b">Họ và tên</th>
                <th className="p-3 border-b">Lớp</th>
                <th className="p-3 border-b text-center">Đúng</th>
                <th className="p-3 border-b text-center">Thời gian</th>
                <th className="p-3 border-b text-center hidden sm:table-cell">NB / TH / VD</th>
                <th className="p-3 border-b hidden md:table-cell">Lúc nộp bài</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                    Chưa có học sinh nào hoàn thành bài thi. Hãy nhập tên học sinh và bắt đầu làm bài.
                  </td>
                </tr>
              ) : (
                records.map((r, idx) => (
                  <tr
                    key={`${r.name}-${r.time}-${idx}`}
                    className={`hover:bg-emerald-50/50 transition-colors ${idx < 3 ? 'bg-amber-50/40' : ''}`}
                  >
                    <td className="p-3 text-center font-mono-num font-bold text-slate-800">
                      #{idx + 1}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{r.name}</td>
                    <td className="p-3 text-slate-600">{r.className}</td>
                    <td className="p-3 text-center font-mono-num font-bold text-emerald-700">
                      {r.correctText}
                    </td>
                    <td className="p-3 text-center font-mono-num font-bold text-sky-700">
                      {r.durationText || '--:--'}
                    </td>
                    <td className="p-3 text-center font-mono-num text-xs text-slate-500 hidden sm:table-cell">
                      {r.nb} | {r.th} | {r.vd}
                    </td>
                    <td className="p-3 font-mono-num text-xs text-slate-400 hidden md:table-cell">
                      {r.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleClear}
            disabled={records.length === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default whitespace-nowrap ${
              confirmClear
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
            }`}
          >
            {confirmClear ? <AlertTriangle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            <span>{confirmClear ? 'Bấm lần nữa để xóa hết' : 'Xóa danh sách'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyZalo}
              className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy gửi Zalo Phụ huynh</span>
            </button>
            <button
              type="button"
              onClick={handleCopySheet}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              <span>Copy dán Google Sheet</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              <span>Tải file (.CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. GOOGLE SHEET WEBHOOK SETTINGS MODAL
   ============================================================================ */
interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPS_SCRIPT_CODE = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Thời gian nộp", "Họ và tên", "Lớp", "Số câu đúng", "Thời gian làm bài", "Điểm", "Nhận biết", "Thông hiểu", "Vận dụng"]);
  }
  sheet.appendRow([data.time, data.name, data.className, data.correctText, data.durationText, data.score, data.nb, data.th, data.vd]);
  return ContentService.createTextOutput("OK");
}`;

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(getWebhookUrl());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FAF9F5] text-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 border border-amber-200 animate-pop-in space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
            Tự động gửi điểm về Google Sheet
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cấu hình"
            className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="font-medium">
            Thầy có thể dán đường link <strong>Google Apps Script Web App</strong> vào bên dưới để mỗi khi học sinh làm xong, kết quả tự động đẩy thẳng vào Google Sheet:
          </p>

          <div>
            <label htmlFor="webhook-url-input" className="block font-bold text-slate-900 mb-1.5">
              Link Web App URL (Google Apps Script):
            </label>
            <input
              id="webhook-url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..../exec"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-emerald-700 focus:outline-none font-medium text-slate-900"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-colors cursor-pointer"
            >
              Lưu cấu hình
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Check className="w-4 h-4" />
                <span>Đã lưu link thành công!</span>
              </span>
            )}
          </div>
        </form>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2">
          <p className="font-bold text-slate-900">
            Hướng dẫn nhanh tạo Google Sheet tự nhận điểm:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 font-medium">
            <li>
              Mở 1 file Google Sheet mới → chọn <strong>Tiện ích mở rộng</strong> → <strong>Apps Script</strong>.
            </li>
            <li>
              Xóa hết mã cũ, dán đoạn mã dưới đây vào và bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới → Ứng dụng web</strong> (Ai có quyền truy cập: <em>Bất kỳ ai</em>):
            </li>
          </ol>
          <pre className="mt-2 p-3 bg-slate-900 text-emerald-300 rounded-xl overflow-x-auto text-[11px] font-mono select-all">
            {APPS_SCRIPT_CODE}
          </pre>
        </div>
      </div>
    </div>
  );
};
