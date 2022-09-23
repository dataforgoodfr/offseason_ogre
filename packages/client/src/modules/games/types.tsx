export interface Game {
  id: number;
  date: Date;
  description?: string;
  name: string;
  status: string;
  step: number;
  lastFinishedStep: number;
  teacherId: number;
}
