import { IGame } from "../../../utils/types";
import { Persona } from "../../persona/persona";

export { getPlayerValuesByStep };

// TODO: use `usePersonaByUserId`/`usePersona` instead.
function getPlayerValuesByStep(
  step: number,
  game: IGame,
  personaByStep: Record<number, Persona>
) {
  if (step >= game.step) {
    return personaByStep[game.lastFinishedStep];
  }
  return personaByStep[step];
}
