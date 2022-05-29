import { CircularProgress } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { IGame, ITeam } from "../../../utils/types";

export { PlayProvider, useLoadedPlay as usePlay };

interface IPlayContext {
  game: IGameWithTeams;
}
type IGameWithTeams = IGame & { teams: ITeam[] };

const PlayContext = React.createContext<IPlayContext | null>(null);

function PlayProvider({ children }: { children: React.ReactNode }) {
  const { id: gameId } = useParams();

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
