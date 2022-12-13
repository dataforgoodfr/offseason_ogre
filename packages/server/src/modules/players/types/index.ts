import { Team, PlayerActions, Profile } from "@prisma/client";

export type { Players };

interface Players {
  gameId: number;
  teamId: number;
  userId: number;
  hasFinishedStep: boolean;
  profileId: number | null;
  team: Team;
  profile: Profile;
  actions: PlayerActions;
}
