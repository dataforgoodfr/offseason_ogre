export type { Game };

interface Game {
  id: number;
  date: Date;
  description: string;
  name: string;
  status: status;
  teacherId: number;
  step: number;
  lastFinishedStep: number;
}

type status = "draft" | "ready" | "playing" | "finished";
