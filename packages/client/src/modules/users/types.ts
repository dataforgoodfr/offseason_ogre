import { Game } from "../administration/Games/types";

export type { Role, RoleName, User };

interface Players {
  gameId: number;
  userId: number;
  teamId: number;
  profileId: number;
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
  roleId: number;
  role: Role;
}

interface Role {
  id: number;
  name: RoleName;
}

type RoleName = "admin" | "player" | "teacher";
