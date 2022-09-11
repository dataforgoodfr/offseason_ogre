import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useMatch } from "react-router-dom";
import {
  Action,
  IGame,
  ITeamWithPlayers,
  Player,
  PlayerActions,
} from "../../../utils/types";
import { useAuth } from "../../auth/authProvider";
import { Persona, persona } from "../../persona/persona";
import { GameStep, MAX_NUMBER_STEPS, STEPS } from "../constants";
import _ from "lodash";
import { ConsumptionDatum } from "../../persona/consumption";
import { computeConsumptionChoices } from "../utils/consumptionStep";
import { sortBy } from "../../../lib/array";

export {
  PlayProvider,
  RootPlayProvider,
  useCurrentPersona,
  useCurrentStep,
  useMyTeam,
  useLoadedPlay as usePlay,
  useResultsByUserId,
  usePlayerActions,
  usePersona,
};

interface IPlayContext {
  game: IGameWithTeams;
  updateGame: (update: Partial<IGame>) => void;
  playerActions: PlayerActions[];
  updatePlayerActions: (
    update: {
      isPerformed: boolean;
      id: number;
    }[]
  ) => void;
  actionPointsLimitExceeded: boolean;
  setActionPointsLimitExceeded: (limitExceeded: boolean) => void;
  player: PlayerState;
  updatePlayer: (options: { hasFinishedStep?: boolean }) => void;
}
type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };

interface PlayerState {
  hasFinishedStep: boolean;
}

const PlayContext = React.createContext<IPlayContext | null>(null);

function RootPlayProvider({ children }: { children: React.ReactNode }) {
  const isPlayRoute = useMatch(`play/games/:gameId/*`);
  if (!isPlayRoute) {
    return <PlayContext.Provider value={null}>{children}</PlayContext.Provider>;
  }
  return <PlayProvider>{children}</PlayProvider>;
}

function PlayProvider({ children }: { children: React.ReactNode }) {
  const match = useMatch(`play/games/:gameId/*`);
  if (!match) throw new Error("Provider use ouside of game play.");
  const gameId = +(match.params.gameId as string);

  const [gameWithTeams, setGameWithTeams] = useState<IGameWithTeams | null>(
    null
  );
  const [playerActions, setPlayerActions] = useState<PlayerActions[]>([]);
  const [actionPointsLimitExceeded, setActionPointsLimitExceeded] =
    useState<boolean>(false);
  // TODO: move actionPointsLimitExceeded and playerActions to this state.
  const [player, setPlayer] = useState<PlayerState>({
    hasFinishedStep: true,
  });
  const { socket } = useGameSocket({
    gameId,
    player,
    setGameWithTeams,
    setPlayerActions,
    setActionPointsLimitExceeded,
    setPlayer,
  });

  if (gameWithTeams === null || socket === null) {
    return <CircularProgress color="secondary" sx={{ margin: "auto" }} />;
  }

  const updateGame = (update: Partial<IGame>) => {
    setGameWithTeams((previous) => {
      if (previous === null) return null;
      return { ...previous, ...update };
    });
    socket.emit("updateGame", { gameId, update });
  };

  const updatePlayerActions = (
    playerActions: {
      isPerformed: boolean;
      id: number;
    }[]
  ) => {
    if (player.hasFinishedStep) {
      return;
    }

    socket.emit("updatePlayerActions", {
      gameId,
      step: gameWithTeams.step,
      playerActions,
    });
  };

  const updatePlayer = ({ hasFinishedStep }: { hasFinishedStep?: boolean }) => {
    socket.emit("updatePlayer", { gameId, hasFinishedStep });
  };

  return (
    <PlayContext.Provider
      value={{
        game: gameWithTeams,
        updateGame,
        playerActions,
        updatePlayerActions,
        actionPointsLimitExceeded,
        setActionPointsLimitExceeded,
        player,
        updatePlayer,
      }}
    >
      {children}
    </PlayContext.Provider>
  );
}

function useLoadedPlay(): IPlayContext {
  const playValue = usePlay();
  if (playValue === null) {
    throw new Error("play context should have been loaded");
  }
  return playValue;
}

function useMyTeam(): ITeamWithPlayers | null {
  const { game: gameWithTeams } = useLoadedPlay();
  const { user } = useAuth();
  if (!user) return null;
  if (!gameWithTeams) return null;
  return (
    gameWithTeams.teams.find((team) =>
      team.players.some((player) => player.userId === user.id)
    ) ?? null
  );
}

// @deprecated
// TODO: remove and use `currentPersona` from `usePersona()` instead.
function useCurrentPersona() {
  return persona;
}

function useCurrentStep(): GameStep | null {
  const playValue = usePlay();
  if (!playValue) {
    throw new Error("play context should have been loaded");
  }
  const game = playValue.game;
  return STEPS?.[game.step] || null;
}

function usePlayerActions() {
  const { game, playerActions } = useLoadedPlay();

  const playerActionsAtCurrentStep = playerActions.filter(
    (pa) => pa.action.step === game.step
  );

  const actionPointsUsedAtCurrentStep = playerActionsAtCurrentStep.reduce(
    (sum, pa) => (pa.isPerformed ? sum + pa.action.actionPointCost : sum),
    0
  );

  return {
    playerActions,
    playerActionsAtCurrentStep,
    actionPointsUsedAtCurrentStep,
    actionPointsAvailableAtCurrentStep: STEPS[game.step].availableActionPoints,
  };
}

function useGameSocket({
  gameId,
  player,
  setGameWithTeams,
  setPlayerActions,
  setActionPointsLimitExceeded,
  setPlayer,
}: {
  gameId: number;
  player: PlayerState;
  setGameWithTeams: React.Dispatch<React.SetStateAction<IGameWithTeams | null>>;
  setPlayerActions: React.Dispatch<React.SetStateAction<PlayerActions[]>>;
  setActionPointsLimitExceeded: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
}): { socket: Socket | null } {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const newSocket = io();

    newSocket.on("resetGameState", (state) => {
      const { gameWithTeams } = state;
      setGameWithTeams(gameWithTeams);
    });

    newSocket.on("gameUpdated", ({ update }: { update: Partial<IGame> }) => {
      setGameWithTeams((previous) => {
        if (previous === null) return null;
        return { ...previous, ...update };
      });
    });

    newSocket.on(
      "playerActionsUpdated",
      ({ playerActions }: { playerActions: PlayerActions[] }) => {
        setPlayerActions(playerActions.sort(sortBy("actionId", "asc")));
      }
    );

    newSocket.on("actionPointsLimitExceeded", () => {
      setActionPointsLimitExceeded(true);
    });

    newSocket.on(
      "playerUpdated",
      ({ update }: { update: Partial<PlayerState> }) => {
        setPlayer({ ...player, ...update });
      }
    );

    newSocket.on("connect", () => {
      newSocket.emit("joinGame", gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [
    // TODO: add dependency `player` without creating a new socket on each `player` update.
    gameId,
    setGameWithTeams,
    setPlayerActions,
    setActionPointsLimitExceeded,
    setPlayer,
  ]);
  return { socket };
}

function usePlay() {
  return React.useContext<IPlayContext | null>(PlayContext);
}

function useResultsByUserId({
  userIds,
}: {
  userIds: number[];
}): Record<number, Record<number, Persona>> {
  const { game: gameWithTeams } = useLoadedPlay();
  return Object.fromEntries(
    userIds.map((userId) => {
      const playerActions = getPlayer(gameWithTeams, userId)?.actions;
      return [userId, getResultsByStep(playerActions || [])];
    })
  );
}

function getPlayer(game: IGameWithTeams, userId: number) {
  const playerTeam = game.teams.find((team: ITeamWithPlayers) =>
    team.players.find((player: Player) => player.userId === userId)
  );

  return playerTeam?.players.find((player: Player) => player.userId === userId);
}

function usePersona() {
  const { game } = useLoadedPlay();
  const { playerActions } = usePlayerActions();

  const personaBySteps = getResultsByStep(playerActions);

  const getPersonaAtStep = (step: number) => {
    let stepUsed = 0;
    if (step >= game.step) {
      stepUsed = game.step;
    }
    if (stepUsed === game.step && game.isStepActive) {
      stepUsed -= 1;
    }
    stepUsed = Math.max(stepUsed, 0);

    return personaBySteps[stepUsed];
  };

  const currentPersona = getPersonaAtStep(game.step);
  const latestPersona = personaBySteps[game.step];

  return {
    personaBySteps,
    /** Persona taking into account player's actions at latest validated step. */
    currentPersona,
    /** Persona taking into account latest player's actions, whether the step is active or not. */
    latestPersona,
    /** Persona taking into account player's actions at specified step. */
    getPersonaAtStep,
  };
}

function getResultsByStep(
  playerActions: PlayerActions[]
): Record<number, Persona> {
  return Object.fromEntries(
    _.range(0, MAX_NUMBER_STEPS).map((step) => [
      step,
      computeResultsByStep(step, playerActions),
    ])
  );
}

function computeResultsByStep(
  step: number,
  playerActions: PlayerActions[]
): Persona {
  if (step === 0) {
    return persona;
  }

  const performedActions = playerActions
    ?.filter(
      (playerAction: PlayerActions) =>
        playerAction.action.step <= step && playerAction.isPerformed === true
    )
    .map((playerAction: PlayerActions) => playerAction.action);

  const costPerDay = performedActions
    ?.map((action: Action) => action.financialCost)
    .reduce((a, b) => a + b, 0);
  const performedActionsNames = performedActions.map(
    (action: Action) => action.name
  );

  const newConsumption = JSON.parse(JSON.stringify(persona.consumption)).map(
    (consumption: ConsumptionDatum) => {
      return computeConsumptionChoices(consumption, performedActionsNames);
    }
  );

  return {
    budget: persona.budget - costPerDay,
    carbonFootprint: persona.carbonFootprint,
    points: persona.points,
    consumption: newConsumption,
    production: persona.production,
  };
}
