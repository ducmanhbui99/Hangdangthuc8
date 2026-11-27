import { useCallback, useEffect, useRef, useState } from 'react';
import { ActiveQuestion, GameState, LevelStats, StudentRecord } from './types/game';
import { prepareShuffledQuestions } from './data/questions';
import { isSoundEnabled, playSound, setSoundEnabled } from './utils/audio';
import { triggerConfettiBurst } from './utils/confetti';
import {
  clearAllStudentRecords,
  formatDuration,
  getSortedRecords,
  getWebhookUrl,
  saveStudentRecord,
} from './utils/storage';
import { TitleScreen } from './components/TitleScreen';
import { QuizArena } from './components/QuizArena';
import { VictoryScreen } from './components/VictoryScreen';
import { LeaderboardModal, PauseModal, SheetSettingsModal } from './components/Modals';

const INITIAL_STATS = (): LevelStats => ({
  'Nhận biết': { correct: 0, total: 10 },
  'Thông hiểu': { correct: 0, total: 6 },
  'Vận dụng': { correct: 0, total: 4 },
});

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('8A');

  const [questions, setQuestions] = useState<ActiveQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stats, setStats] = useState<LevelStats>(INITIAL_STATS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [zoomScale, setZoomScale] = useState(1.0);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [records, setRecords] = useState<StudentRecord[]>(() => getSortedRecords());
  const [syncStatus, setSyncStatus] = useState<'local' | 'syncing' | 'synced'>('local');

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSheetSettings, setShowSheetSettings] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Sync CSS zoom scale variable
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-scale', String(zoomScale));
  }, [zoomScale]);

  const handleChangeZoom = useCallback((delta: number) => {
    setZoomScale((prev) =>
      Math.min(2.05, Math.max(0.85, Math.round((prev + delta) * 100) / 100))
    );
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomScale(1.0);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      if (next) playSound('click');
      return next;
    });
  }, []);

  // Timer ticks only during active PLAYING state (automatically freezes when PAUSED)
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

  // Global Esc handler for Pause / Modal dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showLeaderboard) {
        setShowLeaderboard(false);
        return;
      }
      if (showSheetSettings) {
        setShowSheetSettings(false);
        return;
      }
      if (gameState === 'PLAYING') {
        setGameState('PAUSED');
      } else if (gameState === 'PAUSED') {
        setGameState('PLAYING');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showLeaderboard, showSheetSettings]);

  const startSession = useCallback((name: string, className: string) => {
    playSound('click');
    setStudentName(name);
    setStudentClass(className);
    setQuestions(prepareShuffledQuestions());
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setStats(INITIAL_STATS());
    setElapsedSeconds(0);
    setSyncStatus('local');
    setGameState('PLAYING');
  }, []);

  const handleSelectAnswer = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null || !questions[currentIndex]) return;
      const q = questions[currentIndex];
      const isCorrect = optionIndex === q.correctIndex;
      setSelectedOption(optionIndex);

      if (isCorrect) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setMaxStreak((prev) => Math.max(prev, nextStreak));
        const bonus = nextStreak >= 3 ? 2 : 0;
        setScore((prev) => prev + 10 + bonus);
        setStats((prev) => ({
          ...prev,
          [q.level]: {
            ...prev[q.level],
            correct: prev[q.level].correct + 1,
          },
        }));
        playSound(nextStreak >= 3 ? 'streak' : 'correct');
        triggerConfettiBurst('mini');
      } else {
        setStreak(0);
        playSound('wrong');
      }
    },
    [selectedOption, questions, currentIndex, streak]
  );

  const finishGame = useCallback(() => {
    playSound('win');
    triggerConfettiBurst('victory');

    const totalCorrect =
      stats['Nhận biết'].correct + stats['Thông hiểu'].correct + stats['Vận dụng'].correct;
    const now = new Date();
    const timeStr =
      now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
      ' ' +
      now.toLocaleDateString('vi-VN');

    const record: StudentRecord = {
      time: timeStr,
      name: studentName,
      className: studentClass,
      score,
      correct: totalCorrect,
      correctText: `${totalCorrect}/20`,
      durationSec: elapsedSeconds,
      durationText: formatDuration(elapsedSeconds),
      nb: `${stats['Nhận biết'].correct}/10`,
      th: `${stats['Thông hiểu'].correct}/6`,
      vd: `${stats['Vận dụng'].correct}/4`,
    };

    saveStudentRecord(record);
    setRecords(getSortedRecords());
    setGameState('VICTORY');

    const webhookUrl = getWebhookUrl();
    if (webhookUrl && webhookUrl.startsWith('https://')) {
      setSyncStatus('syncing');
      fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      })
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('local'));
    } else {
      setSyncStatus('local');
    }
  }, [stats, studentName, studentClass, score, elapsedSeconds]);

  const handleNextQuestion = useCallback(() => {
    playSound('click');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      finishGame();
    }
  }, [currentIndex, questions.length, finishGame]);

  const handleClearRecords = useCallback(() => {
    clearAllStudentRecords();
    setRecords([]);
  }, []);

  const currentQuestion = questions[currentIndex];

  return (
    <>
      {gameState === 'TITLE_MENU' && (
        <TitleScreen
          initialName={studentName}
          initialClass={studentClass}
          recordCount={records.length}
          soundEnabled={soundOn}
          onToggleSound={handleToggleSound}
          onStart={startSession}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenSheetSettings={() => setShowSheetSettings(true)}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'PAUSED') && currentQuestion && (
        <QuizArena
          studentName={studentName}
          studentClass={studentClass}
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          score={score}
          streak={streak}
          elapsedSeconds={elapsedSeconds}
          zoomScale={zoomScale}
          soundEnabled={soundOn}
          recordCount={records.length}
          selectedOption={selectedOption}
          onChangeZoom={handleChangeZoom}
          onResetZoom={handleResetZoom}
          onToggleSound={handleToggleSound}
          onOpenPause={() => setGameState('PAUSED')}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onSelectAnswer={handleSelectAnswer}
          onNextQuestion={handleNextQuestion}
          onUseHint={() => playSound('hint')}
        />
      )}

      {gameState === 'VICTORY' && (
        <VictoryScreen
          studentName={studentName}
          studentClass={studentClass}
          score={score}
          maxStreak={maxStreak}
          elapsedSeconds={elapsedSeconds}
          stats={stats}
          sortedRecords={records}
          syncStatus={syncStatus}
          onNextStudent={() => {
            setStudentName('');
            setGameState('TITLE_MENU');
          }}
          onRestartSameStudent={() => startSession(studentName, studentClass)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      <PauseModal
        isOpen={gameState === 'PAUSED'}
        soundEnabled={soundOn}
        onResume={() => setGameState('PLAYING')}
        onRestart={() => startSession(studentName, studentClass)}
        onExitToTitle={() => setGameState('TITLE_MENU')}
        onToggleSound={handleToggleSound}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        records={records}
        onClose={() => setShowLeaderboard(false)}
        onClearAll={handleClearRecords}
      />

      <SheetSettingsModal
        isOpen={showSheetSettings}
        onClose={() => setShowSheetSettings(false)}
      />
    </>
  );
}
