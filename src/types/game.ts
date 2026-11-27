export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'VICTORY';

export type QuestionLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';

export interface RawQuestion {
  id: number;
  level: QuestionLevel;
  /** Prompt text with optional math expressions delimited by `[[...]]` */
  prompt: string;
  /** 4 option strings rendered as math expressions */
  options: [string, string, string, string];
  /** Index (0-3) of the correct option in `options` */
  correct: number;
  /** Tier-1 hint: identity family name */
  hintTitle: string;
  /** Tier-2 hint: formula pattern or first step */
  hintDetail: string;
  /** Full step-by-step explanation shown after answering */
  explain: string;
}

export interface ActiveQuestion {
  id: number;
  level: QuestionLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  hintTitle: string;
  hintDetail: string;
  explain: string;
}

export interface LevelStats {
  'Nhận biết': { correct: number; total: number };
  'Thông hiểu': { correct: number; total: number };
  'Vận dụng': { correct: number; total: number };
}

export interface StudentRecord {
  time: string;
  name: string;
  className: string;
  score: number;
  correct: number;
  correctText: string;
  durationSec: number;
  durationText: string;
  nb: string;
  th: string;
  vd: string;
}
