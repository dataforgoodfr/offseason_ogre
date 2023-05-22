import { IGameWithTeams } from "../../../utils/types";
import { LARGE_GAME_TEAMS, STEPS } from "../constants";

export const isLargeGame = (game: IGameWithTeams) => {
  return game.teams.length > LARGE_GAME_TEAMS;
};

export const isSynthesisStep = (game: IGameWithTeams) => {
  return game.step === STEPS.length - 1;
};
