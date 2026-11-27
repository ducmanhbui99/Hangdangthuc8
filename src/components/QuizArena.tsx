import React, { useEffect, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Trophy,
  Pause,
  Lightbulb,
  ArrowRight,
  Flag,
  CheckCircle2,
  XCircle,
  Flame,
  Clock,
  Star,
} from 'lucide-react';
import { ActiveQuestion } from '../types/game';
import { MathExpr, PromptText } from './MathExpr';
import { formatDuration } from '../utils/storage';

interface QuizArenaProps {
  studentName: string;
  studentClass: string;
  question: ActiveQuestion;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  elapsedSeconds: number;
  zoomScale: number;
  soundEnabled: boolean;
  recordCount: number;
  selectedOption: number | null;
  onChangeZoom: (delta: number) => void;
  onResetZoom: () => void;
  onToggleSound: () => void;
  onOpenPause: () => void;
  onOpenLeaderboard: () => void;
  onSelectAnswer: (optionIndex: number) => void;
  onNextQuestion: () => void;
  onUseHint: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export const QuizArena: React.FC<QuizArenaProps> = ({
  studentName,
  studentClass,
  question,
  currentIndex,
  totalQuestions,
  score,
  streak,
  elapsedSeconds,
  zoomScale,
  soundEnabled,
  recordCount,
  selectedOption,
  onChangeZoom,
  onResetZoom,
  onToggleSound,
  onOpenPause,
  onOpenLeaderboard,
  onSelectAnswer,
  onNextQuestion,
  onUseHint,
}) => {
  const [hintTier, setHintTier] = useState<0 | 1 | 2>(0);

  // Reset hint tier when advancing to a new question
  useEffect(() => {
    setHintTier(0);
  }, [question.id, currentIndex]);

  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === question.correctIndex;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const singleColMode = zoomScale >= 1.3;

  const handleHintClick = () => {
    if (isAnswered || hintTier >= 2) return;
    setHintTier((prev) => (prev === 0 ? 1 : 2));
    onUseHint();
  };

  // Keyboard shortcuts for active quiz play
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();

      if (!isAnswered) {
        if (key === '1' || key === 'a') onSelectAnswer(0);
        else if (key === '2' || key === 'b') onSelectAnswer(1);
        else if (key === '3' || key === 'c') onSelectAnswer(2);
        else if (key === '4' || key === 'd') onSelectAnswer(3);
        else if (key === 'h') handleHintClick();
      } else if (key === 'enter' || key === ' ') {
        e.preventDefault();
        onNextQuestion();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const levelTone =
    question.level === 'Nhận biết'
      ? 'text-emerald-300'
      : question.level === 'Thông hiểu'
        ? 'text-amber-300'
        : 'text-rose-300';

  return (
    <div className="min-h-screen w-full chalkboard-grid text-slate-100 flex flex-col">
      {/* Compact Top HUD Bar (<12% viewport height) */}
      <header className="sticky top-0 z-30 bg-[#081914]/95 border-b border-emerald-800/60 px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Student & Level Metadata (no pill enclosures) */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display font-bold text-sm sm:text-base text-white truncate max-w-[180px] sm:max-w-xs">
              {studentName} <span className="text-emerald-300/80 font-medium">({studentClass})</span>
            </span>
            <span className="text-emerald-700" aria-hidden="true">·</span>
            <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${levelTone}`}>
              {question.level}
            </span>
          </div>

          {/* Center: Projector Zoom Control */}
          <div
            className="flex items-center gap-1 bg-emerald-950/90 border border-emerald-800/70 rounded-xl px-2 py-1"
            title="Phóng to / thu nhỏ cỡ chữ cho học sinh ngồi xa"
          >
            <button
              type="button"
              onClick={() => onChangeZoom(-0.15)}
              aria-label="Thu nhỏ chữ"
              className="w-8 h-8 rounded-lg hover:bg-emerald-800/70 flex items-center justify-center text-emerald-100 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onResetZoom}
              title="Đặt lại 100%"
              className="px-2 py-1 rounded-lg hover:bg-emerald-800/70 font-mono-num text-xs font-bold text-amber-300 min-w-[3.2rem] text-center transition-colors cursor-pointer"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => onChangeZoom(0.15)}
              aria-label="Phóng to chữ"
              className="w-8 h-8 rounded-lg bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Telemetry + Utility Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 font-mono-num text-sm sm:text-base font-bold">
              {streak >= 2 && (
                <span className="inline-flex items-center gap-1 text-orange-300" title="Chuỗi câu đúng liên tiếp">
                  <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span>{streak}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-sky-200" title="Thời gian làm bài">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>{formatDuration(elapsedSeconds)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-300" title="Tổng điểm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{score}</span>
              </span>
            </div>

            <div className="h-5 w-px bg-emerald-800/80 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenLeaderboard}
                title="Bảng xếp hạng"
                className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/70 text-emerald-100 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-mono-num">{recordCount}</span>
              </button>
              <button
                type="button"
                onClick={onToggleSound}
                aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                className="p-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/70 text-amber-300 transition-colors cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <button
                type="button"
                onClick={onOpenPause}
                aria-label="Tạm dừng"
                title="Tạm dừng (Esc)"
                className="p-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/70 text-emerald-100 transition-colors cursor-pointer"
              >
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Playfield — Clean, Unobstructed Classroom Arena */}
      <main className="flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7 gap-4 sm:gap-5">
        {/* Progress Indicator + Optional Hint Trigger */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-100/90 mb-1.5">
              <span>
                Câu hỏi <span className="font-mono-num text-amber-300 text-base">{currentIndex + 1}</span> / {totalQuestions}
              </span>
              <span className="font-mono-num text-emerald-300">{progressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-200 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {!isAnswered && (
            <button
              type="button"
              onClick={handleHintClick}
              disabled={hintTier >= 2}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                hintTier >= 2
                  ? 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400/60 cursor-default'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/50 text-amber-200'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>{hintTier === 0 ? 'Gợi ý (H)' : hintTier === 1 ? 'Gợi ý thêm' : 'Đã mở gợi ý'}</span>
            </button>
          )}
        </div>

        {/* Crisp Ivory Question Surface */}
        <section className="bg-[#FAF9F5] text-slate-900 rounded-2xl p-5 sm:p-8 shadow-2xl border border-amber-100 space-y-5 animate-pop-in">
          {/* Question Prompt */}
          <div className="text-center py-2">
            <h2 className="scalable-title font-bold text-slate-900 text-balance">
              <PromptText text={question.prompt} />
            </h2>
          </div>

          {/* Multi-tier Hint Area (shown only if requested) */}
          {hintTier > 0 && !isAnswered && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-950 scalable-hint animate-pop-in">
              <div className="font-bold flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{question.hintTitle}</span>
              </div>
              {hintTier >= 2 && (
                <p className="mt-1 text-amber-900 font-medium">{question.hintDetail}</p>
              )}
            </div>
          )}

          {/* 4 Answer Options Grid */}
          <div className={`grid gap-3 sm:gap-4 ${singleColMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {question.options.map((optText, idx) => {
              const isThisCorrect = idx === question.correctIndex;
              const isThisSelected = idx === selectedOption;

              let cardStyle =
                'bg-white border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 text-slate-900';
              let badgeStyle = 'bg-slate-100 text-slate-800 border-slate-200';
              let statusLabel: string | null = null;

              if (isAnswered) {
                if (isThisCorrect) {
                  cardStyle = 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200 text-emerald-950';
                  badgeStyle = 'bg-emerald-700 text-white border-emerald-700';
                  statusLabel = 'Đáp án đúng';
                } else if (isThisSelected && !isThisCorrect) {
                  cardStyle = 'bg-rose-50 border-rose-500 text-rose-950 animate-shake-x';
                  badgeStyle = 'bg-rose-600 text-white border-rose-600';
                  statusLabel = 'Chưa đúng';
                } else {
                  cardStyle = 'bg-white/70 border-slate-200 text-slate-400 opacity-60';
                  badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={`${question.id}-${idx}`}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => onSelectAnswer(idx)}
                  className={`group w-full min-h-[58px] text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-center gap-3.5 cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-emerald-700 active:scale-[0.99] ${cardStyle}`}
                >
                  <span
                    className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg border font-display font-bold flex items-center justify-center text-base transition-colors ${badgeStyle}`}
                  >
                    {OPTION_LETTERS[idx]}
                  </span>
                  <span className="scalable-option font-semibold flex-1">
                    <MathExpr expr={optText} />
                  </span>
                  {statusLabel && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold">
                      {isThisCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                      <span className="hidden sm:inline">{statusLabel}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback + Step-by-Step Explanation */}
          {isAnswered && (
            <div
              className={`rounded-xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pop-in ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 font-display font-extrabold text-base sm:text-lg">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>
                        {streak >= 3
                          ? `Chính xác! Chuỗi ${streak} câu đúng liên tiếp (+12 điểm)`
                          : 'Chính xác! Giỏi lắm (+10 điểm)'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>Chưa chính xác! Xem hướng dẫn giải bên dưới:</span>
                    </>
                  )}
                </div>
                <p className="scalable-explanation font-medium text-slate-800">{question.explain}</p>
              </div>

              <button
                type="button"
                onClick={onNextQuestion}
                className="w-full sm:w-auto shrink-0 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:translate-y-0.5 text-white font-display font-bold text-sm sm:text-base shadow-md transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-amber-500"
              >
                <span>{currentIndex === totalQuestions - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
                {currentIndex === totalQuestions - 1 ? (
                  <Flag className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
