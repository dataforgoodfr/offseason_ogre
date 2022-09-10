import { Team, PlayerActions } from "@prisma/client";

export type { Players };

interface Players {
  gameId: number;
  teamId: number;
  userId: number;
  hasFinishedStep: boolean;
  team: Team;
  actions: PlayerActions;
}
