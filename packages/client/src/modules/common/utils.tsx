import { IGame } from "../../utils/types";
import { getStepIndexById } from "../play";

export function roundValue(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function hasNuclear(game: IGame) {
  return game.step >= getStepIndexById("production-3");
}

export function filterOutDuplicates(value: any, index: number, array: any[]) {
  return array.indexOf(value) === index;
}
