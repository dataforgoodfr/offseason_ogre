export type { Game };

interface Game {
  id: number;
  date: Date;
  description: string;
  name: string;
  status: status;
  teacherId: number;
  step: number;
  isStepActive: boolean;
}

type status = "draft" | "ready" | "finished";
