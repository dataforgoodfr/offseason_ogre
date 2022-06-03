import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useMatch } from "react-router-dom";
import { IGame, ITeamWithPlayers } from "../../../utils/types";

export { PlayProvider, useLoadedPlay as usePlay, RootPlayProvider };

interface IPlayContext {
  game: IGameWithTeams;
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
  useGameSocket({ gameId, setGameWithTeams });

  if (gameWithTeams === null) {
    return <CircularProgress color="secondary" sx={{ margin: "auto" }} />;
  }

  return (
    <PlayContext.Provider value={{ game: gameWithTeams }}>
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
}) {
  useEffect(() => {
    const socket = io();

    socket.on("resetGameState", (state) => {
      const { gameWithTeams } = state;
      setGameWithTeams(gameWithTeams);
    });

    socket.on("connect", () => {
      socket.emit("joinGame", gameId);
    });

    socket.on("disconnect", () => {
      console.log("disconnect", socket.id);
    });
  }, [gameId, setGameWithTeams]);
}

function usePlay() {
  return React.useContext<IPlayContext | null>(PlayContext);
}
