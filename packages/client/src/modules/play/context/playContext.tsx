import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useMatch } from "react-router-dom";
import { IGame, ITeamWithPlayers } from "../../../utils/types";

export { PlayProvider, useLoadedPlay as usePlay, RootPlayProvider };

interface IPlayContext {
  game: IGameWithTeams;
  updateGame: (update: Partial<IGame>) => void;
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

  return (
    <PlayContext.Provider value={{ game: gameWithTeams, updateGame }}>
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
