import { Team } from "@prisma/client";

export type { User, Players };

interface User {
  id: number;
  country: string;
  email: string;
  firstName: string;
  isTeacher: boolean;
  lastName: string;
}

interface Players {
  gameId: number;
  teamId: number;
  userId: number;
  team: Team;
}
