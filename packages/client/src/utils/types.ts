import { Game } from "../modules/games/types";
import { User } from "../modules/users/types";

export type IGame = Game;

export interface ITeam {
  id: number;
  name: string;
}
export type ITeamWithPlayers = ITeam & {
  players: { gameId: number; teamId: number; userId: number; user: IUser }[];
};

export type IUser = User;
