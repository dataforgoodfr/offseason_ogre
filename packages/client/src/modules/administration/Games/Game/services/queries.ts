import axios from "axios";
import { useQuery } from "react-query";

export interface Team {
  id: number;
  gameId: number;
  name: string;
  scenarioName: string;
}

export const usePlayers = (gameId: number) =>
  useQuery(`/api/games/${gameId}/players`, () => {
    return axios.get<undefined, { data: { players: any[] } }>(
      `/api/games/${gameId}/players`
    );
  });

export const getTeamQueryPath = (gameId: number) =>
  `/api/teams?${new URLSearchParams({
    gameId: `${gameId}`,
  })}`;

type useTeamsApiResponse = { data: { teams: Team[] } };
export const useTeams = (
  teamQueryPath: string,
  options: { onSuccess?: (data: useTeamsApiResponse) => void } = {}
) =>
  useQuery(
    teamQueryPath,
    () => {
      return axios.get<undefined, useTeamsApiResponse>(teamQueryPath);
    },
    options
  );
