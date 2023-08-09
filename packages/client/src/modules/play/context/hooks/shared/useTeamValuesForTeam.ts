import { range } from "lodash";
import { useMemo } from "react";
import { TeamValues, usePersonaByUserId, usePlay } from "../../playContext";
import { mean } from "../../../../../lib/math";
import { GameStepType, isStepOfType } from "../../../constants";
import { IGame, Player } from "../../../../../utils/types";
import { sumAllValues } from "../../../../persona";

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

function buildStepToData(
  dataType: GameStepType,
  game: IGame,
  players: Player[],
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  return Object.fromEntries(
    range(0, game.lastFinishedStep + 1)
      .filter((step) => isStepOfType(step, dataType))
      .map((step: number) => [
        step,
        buildStepData(dataType, step, players, personaByUserId),
      ])
  );
}

function buildStepData(
  dataType: GameStepType,
  step: number,
  players: Player[],
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  return mean(
    players
      .map((p) => personaByUserId[p.userId].getPersonaAtStep(step)[dataType])
      .map((data) =>
        parseInt(sumAllValues(data as { type: string; value: number }[]))
      )
  );
}
