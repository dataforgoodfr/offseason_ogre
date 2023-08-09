import { useMemo } from "react";
import { TeamValues, usePersonaByUserId, usePlay } from "../../playContext";
import { mean } from "../../../../../lib/math";
import { buildStepToData } from "./utils";

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

    const playersInTeam = players.filter((p) => p.teamId === team?.id);
    const playerRepresentingTeam = playersInTeam[0] || null;
    const personaRepresentingTeam =
      personaByUserId[playerRepresentingTeam?.userId || -1] || null;
    const currentPersonaRepresentingTeam =
      personaRepresentingTeam?.getPersonaAtStep?.(game.step) || null;

    return {
      id: team?.id || 0,
      playerCount: playersInTeam.length,
      points: mean(
        playersInTeam.map(
          ({ userId }) => personaByUserId[userId].currentPersona.points
        )
      ),
      budget: mean(
        playersInTeam.map(
          ({ userId }) => personaByUserId[userId].currentPersona.budget
        )
      ),
      budgetSpent: mean(
        playersInTeam
          .map(({ userId }) => personaByUserId[userId])
          .map(
            (persona) =>
              persona.getPersonaAtStep(0).budget - persona.currentPersona.budget
          )
      ),
      carbonFootprint: mean(
        playersInTeam.map(
          ({ userId }) => personaByUserId[userId].currentPersona.carbonFootprint
        )
      ),
      carbonFootprintReduction: mean(
        playersInTeam
          .map(({ userId }) => personaByUserId[userId])
          .map(
            (persona) =>
              (1 -
                persona.currentPersona.carbonFootprint /
                  persona.getPersonaAtStep(0).carbonFootprint) *
              100
          )
      ),
      stepToConsumption: buildStepToData(
        "consumption",
        game,
        playersInTeam,
        personaByUserId
      ),
      stepToProduction: buildStepToData(
        "production",
        game,
        playersInTeam,
        personaByUserId
      ),
      productionCurrent: currentPersonaRepresentingTeam?.production || [],
    };
  }, [game, personaByUserId, players, teamId, teams]);

  return {
    teamValues,
  };
}
