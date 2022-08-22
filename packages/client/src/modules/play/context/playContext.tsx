import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useMatch } from "react-router-dom";
import { IGame, ITeamWithPlayers, PlayerActions } from "../../../utils/types";
import { useAuth } from "../../auth/authProvider";
import { Persona, persona } from "../../persona/persona";
import { GameStep, MAX_NUMBER_STEPS, STEPS } from "../constants";
import _ from "lodash";

export {
  PlayProvider,
  RootPlayProvider,
  useCurrentPersona,
  useCurrentStep,
  useMyTeam,
  useLoadedPlay as usePlay,
  usePersonaByStep,
  usePersonaByUserId,
  usePlayerActions,
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
}
type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };

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
  const { socket } = useGameSocket({
    gameId,
    setGameWithTeams,
    setPlayerActions,
    setActionPointsLimitExceeded,
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
    socket.emit("updatePlayerActions", {
      gameId,
      step: gameWithTeams.step,
      playerActions,
    });
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

function usePersonaByStep(): Record<string, Persona> {
  return Object.fromEntries(
    _.range(0, MAX_NUMBER_STEPS).map((step) => [step, persona])
  );
}

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

function usePersonaByUserId({
  userIds,
}: {
  userIds: number[];
}): Record<number, Persona> {
  return Object.fromEntries(userIds.map((userId) => [userId, persona]));
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
  setGameWithTeams,
  setPlayerActions,
  setActionPointsLimitExceeded,
}: {
  gameId: number;
  setGameWithTeams: React.Dispatch<React.SetStateAction<IGameWithTeams | null>>;
  setPlayerActions: React.Dispatch<React.SetStateAction<PlayerActions[]>>;
  setActionPointsLimitExceeded: React.Dispatch<React.SetStateAction<boolean>>;
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
        setPlayerActions(playerActions);
      }
    );

    newSocket.on("actionPointsLimitExceeded", () => {
      setActionPointsLimitExceeded(true);
    });

    newSocket.on("connect", () => {
      newSocket.emit("joinGame", gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [
    gameId,
    setGameWithTeams,
    setPlayerActions,
    setActionPointsLimitExceeded,
  ]);
  return { socket };
}

function usePlay() {
  return React.useContext<IPlayContext | null>(PlayContext);
}
