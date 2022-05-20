export type { Game };

interface Game {
  id: number;
  date: Date;
  name: string;
  teacherId: number;
  description: string;
  status: boolean;
}
