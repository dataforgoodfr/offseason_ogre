import { useMemo } from "react";
import { TeamValues, usePersonaByUserId, usePlay } from "../../playContext";
import { buildTeamValues } from "./utils";

export { useTeamValuesForTeam };

function useTeamValuesForTeam({ teamId }: { teamId?: number }): {
  teamValues: TeamValues;
} {
  const { game, players, teams } = usePlay();

  const userIds: number[] = useMemo(
    () => players.filter((p) => p.teamId === teamId).map((p) => p.userId),
    [players, teamId]
  );
  const personaByUserId = usePersonaByUserId(userIds);

  const teamValues = useMemo(() => {
    const team = teams.find((t) => t.id === teamId);
    return buildTeamValues({ game, personaByUserId, players, team });
  }, [game, personaByUserId, players, teamId, teams]);

  return {
    teamValues,
  };
}
