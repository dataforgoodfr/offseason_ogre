import { useMemo } from "react";
import { TeamValues, usePersonaByUserId, usePlay } from "../../playContext";
import { buildTeamValues } from "./utils";

export { useTeamValues };

function useTeamValues(): {
  teamValues: TeamValues[];
  getTeamById: (id: number | undefined) => TeamValues | undefined;
} {
  const { game, players, teams } = usePlay();

  const userIds: number[] = useMemo(
    () => players.map((p) => p.userId),
    [players]
  );
  const personaByUserId = usePersonaByUserId(userIds);

  const teamValues = useMemo(() => {
    return teams.map((team) => {
      return buildTeamValues({
        game,
        personaByUserId,
        players,
        team,
      });
    });
    // TODO: check `personaByUserId` in deps doesn't trigger infinite renders.
  }, [game, personaByUserId, players, teams]);

  const getTeamById = (id: number | undefined) => {
    return teamValues.find((t) => t.id === id);
  };

  return {
    teamValues,
    getTeamById,
  };
}
