import { IGame } from "../../../utils/types";
import { Persona } from "../../persona/persona";

export { getLastCompletedStepPlayerValues, getPlayerValuesByStep };

// TODO: use `usePersonaByUserId`/`usePersona` instead.
function getLastCompletedStepPlayerValues(
  game: IGame,
  personaByStep: Record<number, Persona>
) {
  if (game.step === 0) {
    return personaByStep[0];
  }
  if (game.isStepActive) {
    return personaByStep[game.step - 1];
  }
  return personaByStep[game.step];
}

// TODO: use `usePersonaByUserId`/`usePersona` instead.
function getPlayerValuesByStep(
  step: number,
  game: IGame,
  personaByStep: Record<number, Persona>
) {
  if (step === 0) {
    return personaByStep[0];
  } else if (step >= game.step) {
    if (game.isStepActive) {
      return personaByStep[game.step - 1];
    }
    return personaByStep[game.step];
  }
  return personaByStep[step];
}
