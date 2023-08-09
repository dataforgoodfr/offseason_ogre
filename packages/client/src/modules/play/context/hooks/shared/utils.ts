import range from "lodash/range";
import { IGame, Player } from "../../../../../utils/types";
import { GameStepType, isStepOfType } from "../../../constants";
import { usePersonaByUserId } from "../../playContext";
import { mean } from "../../../../../lib/math";
import { sumAllValues } from "../../../../persona";

export { buildStepToData };

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
