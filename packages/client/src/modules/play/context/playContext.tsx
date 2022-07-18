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
import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";

export {
  PlayProvider,
  RootPlayProvider,
  useCurrentPersona,
  useCurrentStep,
  useMyTeam,
  useLoadedPlay as usePlay,
  usePersonaByStep,
  usePersonaByUserId,
};

interface IPlayContext {
  game: IGameWithTeams;
  updateGame: (update: Partial<IGame>) => void;
  updatePlayerActions: (
    playerActions: { id: number; isPerformed: boolean }[]
  ) => void;
  playerActions: PlayerActions[];
  setPlayerActionsLocal: (playerActions: PlayerActions[]) => void;
  playerActionsQuery: UseQueryResult<any>;
  fetchPlayerActions: (step: number) => void;
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
  const { socket } = useGameSocket({ gameId, setGameWithTeams });
  const [step, setStep] = useState(0);
  const [playerActions, setPlayerActions] = useState<PlayerActions[]>([]);

  const playerActionsQuery = useQuery(
    ["actions", gameId, gameWithTeams],
    ({ queryKey }) => {
      const [_, gameId, gameWithTeams]: [
        string,
        number,
        IGameWithTeams | null
      ] = queryKey as any;
      if (!gameId || !gameWithTeams?.step) {
        return Promise.resolve({ data: { playerActions: [] } });
      }

      return axios.get<undefined, { data: { playerActions: PlayerActions[] } }>(
        `/api/actions/me?step=${gameWithTeams.step}&gameId=${gameId}`
      );
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (gameWithTeams && gameWithTeams?.step !== step) {
      setStep(gameWithTeams.step ?? 0);
    }
  }, [step, gameWithTeams]);

  useEffect(() => {
    if (playerActionsQuery.isSuccess) {
      setPlayerActions(playerActionsQuery?.data?.data?.playerActions ?? []);
    }
  }, [playerActionsQuery.isSuccess]);

  useEffect(() => {
    playerActionsQuery.refetch();
  }, [step, playerActionsQuery]);

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
    playerActions: { id: number; isPerformed: boolean }[]
  ) => {
    socket.emit("updatePlayerActions", { update: { playerActions } });
  };

  const fetchPlayerActions = (step: number) => {
    setStep(step);
  };

  return (
    <PlayContext.Provider
      value={{
        game: gameWithTeams,
        updateGame,
        updatePlayerActions,
        playerActions,
        setPlayerActionsLocal: setPlayerActions,
        playerActionsQuery,
        fetchPlayerActions,
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

function useGameSocket({
  gameId,
  setGameWithTeams,
}: {
  gameId: number;
  setGameWithTeams: React.Dispatch<React.SetStateAction<IGameWithTeams | null>>;
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

    newSocket.on("connect", () => {
      newSocket.emit("joinGame", gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [gameId, setGameWithTeams]);
  return { socket };
}

function usePlay() {
  return React.useContext<IPlayContext | null>(PlayContext);
}
