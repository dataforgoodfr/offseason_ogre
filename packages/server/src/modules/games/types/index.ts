export type { Game };

interface Game {
  id: number;
  date: Date;
  description: string;
  name: string;
  status: status;
  teacherId: number;
}

type status = "draft" | "ready";
