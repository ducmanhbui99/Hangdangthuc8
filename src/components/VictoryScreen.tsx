import React, { useState } from 'react';
import {
  Trophy,
  UserPlus,
  RotateCcw,
  FileSpreadsheet,
  Share2,
  CheckCircle2,
  CloudUpload,
} from 'lucide-react';
import { LevelStats, StudentRecord } from '../types/game';
import { buildZaloReport, copyToClipboard, formatDuration } from '../utils/storage';

interface VictoryScreenProps {
  studentName: string;
  studentClass: string;
  score: number;
  maxStreak: number;
  elapsedSeconds: number;
  stats: LevelStats;
  sortedRecords: StudentRecord[];
  syncStatus: 'local' | 'syncing' | 'synced';
  onNextStudent: () => void;
  onRestartSameStudent: () => void;
  onOpenLeaderboard: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  studentName,
  studentClass,
  score,
  maxStreak,
  elapsedSeconds,
  stats,
  sortedRecords,
  syncStatus,
  onNextStudent,
  onRestartSameStudent,
  onOpenLeaderboard,
}) => {
  const [zaloCopied, setZaloCopied] = useState(false);

  const totalCorrect =
    stats['Nhận biết'].correct + stats['Thông hiểu'].correct + stats['Vận dụng'].correct;

  let headline = 'Cố gắng lên! Ôn lại công thức để bứt phá nhé';
  if (totalCorrect >= 17) {
    headline = 'Xuất sắc! Bậc thầy 7 hằng đẳng thức';
  } else if (totalCorrect >= 12) {
    headline = 'Làm tốt lắm! Tiếp tục phát huy nhé';
  }

  const handleCopyZalo = async () => {
    const text = buildZaloReport(sortedRecords);
    const ok = await copyToClipboard(text);
    if (ok) {
      setZaloCopied(true);
      setTimeout(() => setZaloCopied(false), 4000);
    }
  };

  return (
    <div className="min-h-screen w-full chalkboard-grid text-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-[#FAF9F5] text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-200/60 animate-pop-in space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                {headline}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-600 mt-0.5">
                {studentName} · Lớp {studentClass}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800">
            {syncStatus === 'syncing' ? (
              <>
                <CloudUpload className="w-4 h-4 text-emerald-700" />
                <span>Đang đồng bộ Google Sheet...</span>
              </>
            ) : syncStatus === 'synced' ? (
              <>
                <CloudUpload className="w-4 h-4 text-emerald-700" />
                <span>Đã đồng bộ Google Sheet</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Đã lưu vào Bảng xếp hạng ({sortedRecords.length} em)</span>
              </>
            )}
          </div>
        </div>

        {/* 4 Core KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center">
            <div className="text-xs font-bold text-slate-500">Tổng điểm</div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {score}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center">
            <div className="text-xs font-bold text-slate-500">Số câu đúng</div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              {totalCorrect}/20
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center">
            <div className="text-xs font-bold text-slate-500">Thời gian</div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-sky-700 mt-1">
              {formatDuration(elapsedSeconds)}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center">
            <div className="text-xs font-bold text-slate-500">Chuỗi đúng dài nhất</div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
              {maxStreak}
            </div>
          </div>
        </div>

        {/* Breakdown Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700">
          <span>
            Nhận biết:{' '}
            <strong className="font-mono-num text-emerald-700">
              {stats['Nhận biết'].correct}/10
            </strong>
          </span>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <span>
            Thông hiểu:{' '}
            <strong className="font-mono-num text-amber-700">
              {stats['Thông hiểu'].correct}/6
            </strong>
          </span>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <span>
            Vận dụng:{' '}
            <strong className="font-mono-num text-rose-700">
              {stats['Vận dụng'].correct}/4
            </strong>
          </span>
        </div>

        {/* Live Class Leaderboard Preview */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>Bảng xếp hạng lớp (Đúng nhiều → Nhanh nhất)</span>
            </h2>
            <button
              type="button"
              onClick={handleCopyZalo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy tin nhắn gửi Zalo Phụ huynh</span>
            </button>
          </div>

          {zaloCopied && (
            <div className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs sm:text-sm font-semibold">
              Đã copy Bảng Vàng! Thầy mở nhóm Zalo Phụ huynh và dán (Ctrl+V) để gửi ngay.
            </div>
          )}

          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3 text-center w-16">Hạng</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3">Lớp</th>
                  <th className="py-2.5 px-3 text-center">Số câu đúng</th>
                  <th className="py-2.5 px-3 text-center">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sortedRecords.map((r, idx) => {
                  const isCurrent =
                    r.name === studentName &&
                    r.durationSec === elapsedSeconds &&
                    r.score === score;
                  return (
                    <tr
                      key={`${r.name}-${r.time}-${idx}`}
                      className={isCurrent ? 'bg-amber-50 text-slate-950 font-bold' : 'hover:bg-slate-50'}
                    >
                      <td className="py-2.5 px-3 text-center font-mono-num font-bold">
                        {idx < 3 ? `#${idx + 1}` : idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        {r.name}
                        {isCurrent && (
                          <span className="ml-2 text-xs font-bold text-emerald-700">· Vừa xong</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{r.className}</td>
                      <td className="py-2.5 px-3 text-center font-mono-num font-bold text-emerald-700">
                        {r.correctText}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono-num font-bold text-sky-700">
                        {r.durationText || '--:--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Primary & Secondary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onNextStudent}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-display font-bold text-sm sm:text-base shadow-md transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>Lượt học sinh tiếp theo</span>
          </button>
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm sm:text-base shadow-md transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Xuất Google Sheet</span>
          </button>
          <button
            type="button"
            onClick={onRestartSameStudent}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-display font-bold text-sm sm:text-base transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
