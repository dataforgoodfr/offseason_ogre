import { Game } from "../modules/games/types";
import { User } from "../modules/users/types";

export type IGame = Game;

export interface ITeam {
  id: number;
  name: string;
}

export interface ITeam {
  name: string;
}
export type IUser = User;
