import { Team } from "@prisma/client";

export type { User, UsersOnGames };

interface User {
  id: number;
  country: string;
  email: string;
  firstName: string;
  isTeacher: boolean;
  lastName: string;
}

interface UsersOnGames {
  gameId: number;
  teamId: number;
  userId: number;
}
