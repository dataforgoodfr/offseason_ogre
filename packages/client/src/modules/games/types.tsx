export interface Game {
  id: number;
  date: Date;
  description?: string;
  name: string;
  status: string;
  teacherId: number;
  step: number;
}
