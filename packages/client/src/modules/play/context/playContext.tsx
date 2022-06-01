import { io } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";
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
  const { gameId } = match.params;

  console.log("PlayProvider");
  React.useEffect(() => {
    const socket = io();
    // client-side
    socket.on("connect", () => {
      console.log("connect", socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
  }, []);

  const { data: result, isLoading } = useQuery(`/api/games/${gameId}`, () => {
    return axios.get<undefined, { data: { document: IGameWithTeams } }>(
      `/api/games/${gameId}`
    );
  });

  if (isLoading) {
    return <CircularProgress color="secondary" sx={{ margin: "auto" }} />;
  }

  const game = result?.data?.document;
  if (typeof game === "undefined") {
    throw new Error("game is undefined");
  }

  return (
    <PlayContext.Provider value={{ game }}>{children}</PlayContext.Provider>
  );
}

function useLoadedPlay(): IPlayContext {
  const playValue = usePlay();
  if (playValue === null) {
    throw new Error("play context should have been loaded");
  }
  return playValue;
}

function usePlay() {
  return React.useContext<IPlayContext | null>(PlayContext);
}
