import { useMemo } from "react";
import { TeamValues, usePersonaByUserId, usePlay } from "../../playContext";
import { mean } from "../../../../../lib/math";
import { buildStepToData } from "./utils";

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
      const playersInTeam = players.filter((p) => p.teamId === team.id);
      const playerRepresentingTeam = playersInTeam[0] || null;
      const personaRepresentingTeam =
        personaByUserId[playerRepresentingTeam?.userId || -1] || null;
      const currentPersonaRepresentingTeam =
        personaRepresentingTeam?.getPersonaAtStep?.(game.step) || null;

      return {
        id: team.id,
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
                persona.getPersonaAtStep(0).budget -
                persona.currentPersona.budget
            )
        ),
        carbonFootprint: mean(
          playersInTeam.map(
            ({ userId }) =>
              personaByUserId[userId].currentPersona.carbonFootprint
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
