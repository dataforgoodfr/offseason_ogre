import { Game } from "../modules/games/types";
import { User } from "../modules/users/types";

export type {
  IGame,
  ITeam,
  ITeamWithPlayers,
  IUser,
  Player,
  Action,
  PlayerActions,
};

type IGame = Game;

interface ITeam {
  id: number;
  name: string;
}
type ITeamWithPlayers = ITeam & {
  players: Player[];
};

type IUser = User;

interface Player {
  gameId: number;
  teamId: number;
  userId: number;
  user: IUser;
  actions: PlayerActions[];
}

interface Action {
  id: number;
  name: string;
  description: string;
  step: number;
  actionPointCost: number;
  financialCost: number;
  players: PlayerActions[];
}

interface PlayerActions {
  id: number;
  player: Player;
  userId: number;
  gameId: number;
  action: Action;
  actionId: number;
  isPerformed: boolean;
}
