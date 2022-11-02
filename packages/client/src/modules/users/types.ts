import { Game } from "../administration/Games/types";

export type { User };

interface Players {
  gameId: number;
  userId: number;
  teamId: number;
}

interface User {
  id: number;
  country: string;
  email: string;
  firstName: string;
  isTeacher: boolean;
  lastName: string;
  taughtGames: Game[];
  playedGames: Players[];
}
