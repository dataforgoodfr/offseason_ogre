import { Server as ServerLib, Socket as SocketLib } from "socket.io";
import {
  Action,
  Game,
  Personalization,
  PlayerActions,
  Players,
  ProductionAction,
  Profile,
  Team,
  TeamActions,
} from "@prisma/client";
import { User } from "../users/types";

export {
  GameInitEmitted,
  PlayerEmitted,
  Server,
  Socket,
  SocketData,
  TeamEmitted,
};

// TODO: type the socket
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListenEvents = any;

type EmitEvents = {
  "game:init": (args: GameInitEmitted) => void;
  "game:update": (args: { update: Partial<Game> }) => void;
  "player:update": (args: { updates: Partial<PlayerEmitted>[] }) => void;
  "player-actions:update": (args: {
    updates: Partial<PlayerEmitted>[];
  }) => void;
  "player-actions:action-points-limit-exceeded": (args: {
    updates: Partial<PlayerEmitted>[];
  }) => void;
  "team:update": (args: { updates: Partial<TeamEmitted>[] }) => void;
};

type GameInitEmitted = {
  game: Game;
  consumptionActions: Action[];
  productionActions: ProductionAction[];
  players: PlayerEmitted[];
  teams: TeamEmitted[];
};
type PlayerEmitted = Players & {
  actionPointsLimitExceeded?: boolean;
  user: User;
  actions: PlayerActions[];
  profile:
    | (Profile & {
        personalization: Personalization;
      })
    | null;
};
type TeamEmitted = Team & {
  actions: TeamActions[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerSideEvents = any;
type SocketData = {
  gameId: number;
  user: User;
};

type Server = ServerLib<ListenEvents, EmitEvents, ServerSideEvents, SocketData>;
type Socket = SocketLib<ListenEvents, EmitEvents, ServerSideEvents, SocketData>;
