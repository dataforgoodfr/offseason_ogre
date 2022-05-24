import { Game } from "../games/types";

export type { User };

interface UsersOnGames {
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
  playedGames: UsersOnGames[];
}
