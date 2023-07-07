import { Game } from "../modules/administration/Games/types";
import { productionActionNames } from "../modules/play";
import { availableActions } from "../modules/play/playerActions/constants/actions";
import { User } from "../modules/users/types";

export type {
  AchievementName,
  IGame,
  IGameWithTeacher,
  IGameWithTeams,
  IEnrichedGame,
  ITeam,
  ITeamWithPlayers,
  IUser,
  Action,
  ActionNames,
  Personalization,
  PersonalizationName,
  Player,
  PlayerActions,
  ProductionAction,
  ProductionActionNames,
  ProductionActionType,
  ProductionActionUnit,
  ProductionCarbonType,
  Profile,
  ProfileStatus,
  TeamAction,
  MaterialsType,
  MetalsType,
  ProductionTypes,
  UnwrapArray,
};

type WithTeacher<T> = T & { teacher: IUser };
type WithTeams<T> = T & { teams: ITeamWithPlayers[] };

type IGame = Game;
type IGameWithTeacher = WithTeacher<IGame>;
type IGameWithTeams = WithTeams<IGame>;
type IEnrichedGame = IGame & {
  isLarge?: boolean;
  isSynthesisStep?: boolean;
  isGameFinished: boolean;
  isStepFinished: boolean;
};

interface ITeam {
  id: number;
  gameId: number;
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
  user: {
    id: number;
    country: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
  };
  profile: Profile;
  actions: PlayerActions[];
  hasFinishedStep: boolean;
  actionPointsLimitExceeded?: boolean;
}

interface Profile {
  id: number;
  userId: number;
  personalizationId: number;
  personalization: Personalization;
  status: ProfileStatus;
  lastStatusUpdate: string;
}

type ProfileStatus = "draft" | "pendingValidation" | "validated";

interface Personalization {
  id: number;
  origin: string;
  personalizationName: PersonalizationName;
  numberAdults: number;
  numberKids: number;
  car: boolean;
  carEnergy: string;
  carConsumption: number;
  carDistanceAlone: number;
  carDistanceHoushold: number;
  carAge: string;
  carDistanceCarsharing: number;
  planeDistance: number;
  trainDistance: number;
  houseType: string;
  houseSurface: number;
  heatingEnergy: string;
  heatingConsumption: number;
  heatingInvoice: number;
  heatPump: boolean;
  heatingTemperature: boolean;
  airConditionning: boolean;
  aCRoomNb: number;
  aCDaysNb: number;
  showerBath: string;
  showerNumber: number;
  showerTime: string;
  cookingKettle: boolean;
  cookingPlateTime: number;
  cookingOvenTime: number;
  cleaningWashingTime: number;
  cleaningDryerTime: number;
  cleaningDishwasherTime: number;
  refrigeratorNumber: number;
  freezerNumber: number;
  lightingSystem: string;
  eatingVegan: boolean;
  eatingVegetables: boolean;
  eatingDairies: boolean;
  eatingEggs: boolean;
  eatingMeat: boolean;
  eatingTinDrink: number;
  eatingZeroWaste: boolean;
  eatingLocal: boolean;
  eatingCatNumber: number;
  eatingDogNumber: number;
  eatingHorse: boolean;
  numericEquipment: boolean;
  numericWebTimeDay: boolean;
  numericVideoTimeDay: boolean;
  clothingQuantity: boolean;
  createdAt: string;
  updatedAt: string;
}

type PersonalizationName = "form" | "oilgre";

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
  userId: number;
  gameId: number;
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
type ProductionCarbonType = "carbonated" | "decarbonated";

interface TeamAction {
  id: number;
  teamId: number;
  actionId: number;
  /**
   * Value chosen by the team.
   * If action unit is `percentage`, value is in [0,100].
   */
  value: number;
  isTouched: boolean;
}

type MaterialsType = "steel" | "cement" | "glass";

type MetalsType = "copper" | "nickel" | "manganese" | "silicium" | "other";

type ProductionTypes =
  | "windOnshore"
  | "windOffshore"
  | "water"
  | "geology"
  | "biomass"
  | "photovoltaic"
  | "nuclear";

type UnwrapArray<T> = T extends Array<infer U> ? U : T;

type AchievementName =
  | "choseToInsulateHome"
  | "choseToKeepCarForLongTime"
  | "choseToReduceComfortTemperature"
  | "choseToStopMeat"
  | "choseToStopPlane"
  | "choseToSwitchToElectricCar"
  | "choseToSwitchToTinyHome"
  | "directEnergyConsumptionLessThanHalfCountryMean"
  | "noFossilInDirectEnergyConsumption"
  | "consumptionAndProductionBalanced"
  | "gameFinished"
  | "nuclearProductionCredible"
  | "nuclearProductionExcessive"
  | "offshoreWindTurbineProductionCredible"
  | "onshoreWindTurbineProductionCredible";
