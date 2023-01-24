import { Game } from "../administration/Games/types";

export { RoleNames };
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

const RoleNames = {
  ADMIN: "admin",
  PLAYER: "player",
  TEACHER: "teacher",
} as const;

type RoleName = typeof RoleNames[keyof typeof RoleNames];
