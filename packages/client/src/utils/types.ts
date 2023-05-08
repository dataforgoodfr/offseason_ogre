import { Game } from "../modules/administration/Games/types";
import { productionActionNames } from "../modules/play";
import { availableActions } from "../modules/play/playerActions/constants/actions";
import { User } from "../modules/users/types";

export type {
  IGame,
  IGameWithTeacher,
  IGameWithTeams,
  ITeam,
  ITeamWithPlayers,
  IUser,
  Action,
  ActionNames,
  Player,
  PlayerActions,
  ProductionAction,
  ProductionActionNames,
  ProductionActionType,
  ProductionActionUnit,
  TeamAction,
  MaterialsType,
  ProductionTypes,
  UnwrapArray,
};

type WithTeacher<T> = T & { teacher: IUser };
type WithTeams<T> = T & { teams: ITeamWithPlayers[] };

type IGame = Game;
type IGameWithTeacher = WithTeacher<IGame>;
type IGameWithTeams = WithTeams<IGame>;

interface ITeam {
  id: number;
  name: string;
  scenarioName: string;
  actions: TeamAction[];
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
  profile: any;
  actions: PlayerActions[];
  hasFinishedStep: boolean;
}

interface Action {
  id: number;
  name: ActionNames;
  description: string;
  step: number;
  helpCardLink: string;
  actionPointCost: number;
  financialCost: number;
  playerActions: PlayerActions[];
}

type ActionNames = typeof availableActions[keyof typeof availableActions];

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

interface PointsInterval {
  min: number;
  max: number;
  points: number;
}

interface ProductionActionCommon {
  id: number;
  name: ProductionActionNames;
  type: ProductionActionType;
  order: number;
  step: number;
  helpCardLink: string;
  min: number;
  max: number;
  credibilityThreshold: number;
  // TODO: see with Gregory for renaming (should be `productionPerKwh` instead)?
  powerNeededKWh: number;
  lcoe: number;
  currentYearPowerNeedGw: number;
  pointsIntervals: PointsInterval[];
  defaultTeamValue: number;
  isPlayable: boolean;
}

interface ProductionActionArea extends ProductionActionCommon {
  unit: "area";
  areaEnergy: number;
  totalEnergy: null;
}

interface ProductionActionPercentage extends ProductionActionCommon {
  unit: "percentage";
  areaEnergy: null;
  totalEnergy: number;
}

type ProductionActionType = "offshore" | "nuclear" | "terrestrial";

type ProductionActionNames = typeof productionActionNames[number];

type ProductionActionUnit = "area" | "percentage";

interface TeamAction {
  id: number;
  teamId: number;
  actionId: number;
  action: ProductionAction;
  /**
   * Value chosen by the team.
   * If action unit is `percentage`, value is in [0,100].
   */
  value: number;
  isTouched: boolean;
}

type MaterialsType = "concrete" | "steel" | "cement" | "glass";

type ProductionTypes =
  | "wind"
  | "water"
  | "geology"
  | "biomass"
  | "photovoltaic"
  | "nuclear";

type UnwrapArray<T> = T extends Array<infer U> ? U : T;
