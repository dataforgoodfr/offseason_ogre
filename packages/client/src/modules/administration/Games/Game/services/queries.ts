import { useQuery } from "react-query";
import { http } from "../../../../../utils/request";

export interface Team {
  id: number;
  gameId: number;
  name: string;
  scenarioName: string;
}

export const usePlayers = (gameId: number) =>
  useQuery(`/api/games/${gameId}/players`, () => {
    return http.get<undefined, { data: { players: any[] } }>(
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
      return http.get<undefined, useTeamsApiResponse>(teamQueryPath);
    },
    options
  );
