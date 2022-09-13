import { Game } from "../modules/games/types";
import { ProductionEnergyNames } from "../modules/play";
import { User } from "../modules/users/types";

export type {
  IGame,
  IGameWithTeams,
  ITeam,
  ITeamWithPlayers,
  IUser,
  Action,
  Player,
  PlayerActions,
  ProductionAction,
  TeamAction,
};

type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };
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
  hasFinishedStep: boolean;
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

type ProductionAction = ProductionActionArea | ProductionActionPercentage;

interface ProductionActionArea {
  name: ProductionEnergyNames;
  unit: "area";
  min: number;
  max: number;
  credibilityThreshold: number;
  areaEnergy: number;
  // TODO: see with Gregory for renaming (should be `productionPerKwh` instead)?
  powerNeededKWh: number;
  lcoe: number;
  currentYearPowerNeedGw: number;
}

interface ProductionActionPercentage {
  name: ProductionEnergyNames;
  unit: "percentage";
  min: number;
  max: number;
  credibilityThreshold: number;
  totalEnergy: number;
  // TODO: see with Gregory for renaming (should be `productionPerKwh` instead)?
  powerNeededKWh: number;
  lcoe: number;
  currentYearPowerNeedGw: number;
}

interface TeamAction {
  /**
   * Value chosen by the team.
   * If action unit is `percentage`, value is in [0,100].
   */
  value: number;
  isTouched: boolean;
  action: ProductionAction;
}
