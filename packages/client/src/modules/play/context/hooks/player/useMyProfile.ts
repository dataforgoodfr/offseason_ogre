import { usePlay } from "../../playContext";
import {
  IEnrichedGame,
  ITeamWithPlayers,
  Player,
} from "../../../../../utils/types";
import { useAuth } from "../../../../auth/authProvider";

export { useMyProfile };

// TODO: get rid of hook once PR refactoring play context store is merged.
function useMyProfile() {
  const { game } = usePlay();
  const { user } = useAuth();
  const profile = user && getUserTeamAndPlayer(game, user.id)?.player?.profile;

  return {
    profile,
    personalization: profile.personalization,
  };
}

function getUserTeamAndPlayer(game: IEnrichedGame, userId: number) {
  const team = game.teams.find((team: ITeamWithPlayers) =>
    team.players.find((player: Player) => player.userId === userId)
  );

  const player = team?.players.find(
    (player: Player) => player.userId === userId
  );

  return { team, player };
}
