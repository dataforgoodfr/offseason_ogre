import { Team } from "@prisma/client";

export type { User, Players };

interface User {
  id: number;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

interface Players {
  gameId: number;
  teamId: number;
  userId: number;
  profileId: number | null;
  team: Team;
}
