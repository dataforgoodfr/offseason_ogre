export type { Game, GameStatus };

interface Game {
  id: number;
  date: string;
  code: string;
  description?: string;
  name: string;
  status: GameStatus;
  step: number;
  lastFinishedStep: number;
  teacherId: number;
  isTest: boolean;
}

type GameStatus = "draft" | "ready" | "playing" | "finished";
