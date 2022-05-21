import { Box, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

interface Team {
  id: number;
  gameId: number;
  name: string;
}

export { GamePlayers };

function GamePlayers() {
  const gameId = useGameId();

  const playersQuery = useQuery(`/api/games/${gameId}/players`, () => {
    return axios.get<undefined, { data: { players: any[] } }>(
      `/api/games/${gameId}/players`
    );
  });
  const teamQueryPath = `/api/teams?${new URLSearchParams({
    gameId: `${gameId}`,
  })}`;
  const teamQuery = useQuery(teamQueryPath, () => {
    return axios.get<undefined, { data: { teams: Team[] } }>(teamQueryPath);
  });

  const queryClient = useQueryClient();
  const changeTeamMutation = useMutation<
    Response,
    { message: string },
    { teamId: number; userId: number }
  >(
    ({ teamId, userId }) => {
      return axios.put("/api/games/change-team", { gameId, teamId, userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );

  if (playersQuery.isLoading || teamQuery.isLoading) {
    return <CircularProgress />;
  }

  const players = playersQuery?.data?.data?.players ?? [];
  const teams = teamQuery?.data?.data?.teams ?? [];

  const rows = players.map(({ playedGames, ...player }) => ({
    ...player,
    teamId: playedGames[0].team.id,
  }));

  return (
    <Box style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={buidColumns({ teams })}
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[10]}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={(newRow, oldRow) => {
          if (newRow.teamId !== oldRow.teamId) {
            changeTeamMutation.mutate({
              teamId: newRow.teamId,
              userId: newRow.id,
            });
          }
          return newRow;
        }}
      />
    </Box>
  );
}

function buidColumns({ teams }: { teams: Team[] }): GridColDef<{
  name: string;
  firstName: string;
  lastName: string;
  playedGames: { team: { id: number; name: string } }[];
}>[] {
  return [
    {
      field: "name",
      headerName: "Nom",
      valueGetter: (params) => {
        const row = params.row;
        return row.firstName + " " + row.lastName;
      },
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "teamId",
      headerName: "Equipe",
      editable: true,
      type: "singleSelect",
      valueOptions: teams.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
      valueFormatter: ({ value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }: { value: any }) => value === optionValue
        );
        return option.label;
      },
      width: 160,
    },
  ];
}

function useGameId() {
  const { id } = useParams();
  if (!id) throw new Error("game id must be defined");
  const gameId = +id;
  return gameId;
}
