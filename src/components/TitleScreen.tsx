import React, { useState } from 'react';
import {
  Play,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  UserCheck,
  Users,
  AlertCircle,
} from 'lucide-react';
import arenaBackdrop from '../assets/images/game_math_arena_bg_1795787526121.jpg';

interface TitleScreenProps {
  initialName: string;
  initialClass: string;
  recordCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onStart: (name: string, className: string) => void;
  onOpenLeaderboard: () => void;
  onOpenSheetSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  initialName,
  initialClass,
  recordCount,
  soundEnabled,
  onToggleSound,
  onStart,
  onOpenLeaderboard,
  onOpenSheetSettings,
}) => {
  const [name, setName] = useState(initialName);
  const [className, setClassName] = useState(initialClass || '8A');
  const [error, setError] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    setError(false);
    onStart(trimmed, className.trim() || '8A');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B201B] text-slate-100 flex flex-col justify-between">
      {/* Atmospheric illustrated key-art backdrop with gentle camera drift */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={arenaBackdrop}
          alt="Không gian bảng phấn Toán học cổ điển"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right opacity-80 animate-ambient-drift"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#081A15] via-[#081A15]/88 to-[#081A15]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081A15] via-transparent to-[#081A15]/50" />
      </div>

      {/* Top minimal utility bar (only functional game shell tools) */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-10 pt-5">
        <div className="text-xs sm:text-sm font-medium text-emerald-200/80 tracking-wide">
          Toán Lớp 8 · Thực hiện bởi <span className="text-amber-300 font-semibold">Thầy Bùi Đức Mạnh</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Bảng xếp hạng</span>
            <span className="font-mono-num text-amber-300 font-bold">({recordCount})</span>
          </button>
          <button
            type="button"
            onClick={onOpenSheetSettings}
            title="Cấu hình đồng bộ Google Sheet"
            aria-label="Cấu hình đồng bộ Google Sheet"
            className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-200 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-amber-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Main Title + Student Registration Split */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-10 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Bespoke SVG Title Lockup over calm negative space */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-3">
            {/* Bespoke inline SVG crest lockup */}
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect x="2" y="2" width="48" height="48" rx="12" fill="#13382F" stroke="#F59E0B" strokeWidth="2" />
              <rect x="9" y="9" width="20" height="20" rx="2" stroke="#FCD34D" strokeWidth="1.75" strokeDasharray="3 2" />
              <rect x="23" y="23" width="20" height="20" rx="2" stroke="#34D399" strokeWidth="1.75" />
              <text
                x="26"
                y="32"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="Outfit, sans-serif"
                fontWeight="800"
                fontSize="20"
              >
                7
              </text>
            </svg>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-300/90">
                Ôn tập đại số lớp 8
              </div>
              <div className="text-sm text-emerald-100/80">
                Chiều xuôi &amp; chiều ngược
              </div>
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-white leading-[1.12] text-balance">
            Đấu Trường <span className="text-amber-300">7 Hằng Đẳng Thức</span> Đáng Nhớ
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/85 max-w-xl leading-relaxed">
            Chinh phục 20 thử thách khai triển và biến đổi đa thức từ cơ bản đến rút gọn biểu thức. Trả lời chính xác liên tiếp để tích lũy chuỗi điểm thưởng và ghi tên lên Bảng Vàng lớp.
          </p>

          {/* Clean unboxed structure summary (zero-pill discipline) */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-emerald-700/40 max-w-lg">
            <div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-emerald-300">10 câu</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Nhận biết</div>
              <div className="text-xs text-emerald-200/70">Công thức gốc</div>
            </div>
            <div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-amber-300">06 câu</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Thông hiểu</div>
              <div className="text-xs text-emerald-200/70">Biến cơ bản x</div>
            </div>
            <div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-rose-300">04 câu</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Vận dụng</div>
              <div className="text-xs text-emerald-200/70">Rút gọn (2x)</div>
            </div>
          </div>
        </div>

        {/* Right: Crisp Ivory Registration Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-[#FAF9F5] text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-200/40 animate-pop-in space-y-5"
          >
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
                Đăng ký vào đấu trường
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Nhập tên học sinh để lưu kết quả và xếp hạng theo tốc độ.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="student-name-input"
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-1.5"
                >
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Họ và tên học sinh</span>
                  <span className="text-rose-600">*</span>
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error && e.target.value.trim()) setError(false);
                  }}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  autoFocus
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    error
                      ? 'border-rose-500 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-emerald-700 focus:ring-emerald-200'
                  }`}
                />
                {error && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Vui lòng nhập họ và tên học sinh trước khi bắt đầu.</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="student-class-input"
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-1.5"
                >
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Lớp / Tổ</span>
                </label>
                <input
                  id="student-class-input"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Ví dụ: 8A1 (hoặc Tổ 1)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:translate-y-0.5 text-white font-display font-bold text-base sm:text-lg shadow-lg shadow-emerald-950/20 transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Bắt đầu chinh phục (20 câu)</span>
            </button>
          </form>
        </div>
      </div>

      {/* Single flat control-hint line */}
      <div className="relative z-10 px-5 pb-4 text-center text-xs text-emerald-200/75 font-medium">
        Phím 1–4 hoặc A–D chọn đáp án · H xem gợi ý · Enter câu tiếp theo · Esc tạm dừng
      </div>
    </div>
  );
};
