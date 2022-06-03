export type { Game };

interface Game {
  id: number;
  date: Date;
  description: string;
  name: string;
  status: status;
  teacherId: number;
  step: number;
  stepStatus: stepStatus;
}

type status = "draft" | "ready";

type stepStatus = "inProgress" | "closed";
