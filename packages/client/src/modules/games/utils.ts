import { IGame } from "../../utils/types";

export { hasFinishedStep };

function hasFinishedStep(game: Partial<IGame>) {
  return game.step === game.lastFinishedStep;
}
