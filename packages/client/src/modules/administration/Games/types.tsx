export type { Game, GameStatus };

interface Game {
  id: number;
  date: Date;
  description?: string;
  name: string;
  status: GameStatus;
  step: number;
  lastFinishedStep: number;
  teacherId: number;
}

type GameStatus = "draft" | "ready" | "playing" | "finished";
