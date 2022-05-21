import { Box, CircularProgress, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Game } from "../../utils/types";

interface Team {
  id: number;
  gameId: number;
  name: string;
}

export { GamePlayers };

function GamePlayers({ game }: { game: Game }): JSX.Element {
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

  if (game.status === "draft") {
    return (
      <Typography align="center">
        L'atelier n'a pas encore été lancé.
      </Typography>
    );
  }

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

interface Row {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  teamId: number;
}

function buidColumns({ teams }: { teams: Team[] }): GridColumns<Row> {
  return [
    {
      field: "name",
      headerName: "Nom",
      valueGetter: (params) => {
        const row = params.row;
        return row.firstName + " " + row.lastName;
      },
      flex: 1,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
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
      flex: 1,
      minWidth: 160,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params: GridRowParams<Row>) => [
        <DeleteActionCellItem params={params} />,
      ],
    },
  ];
}

function DeleteActionCellItem({ params }: { params: GridRowParams<Row> }) {
  const queryClient = useQueryClient();
  const gameId = useGameId();
  const userId = params.row.id;
  const removePlayerMutation = useMutation<Response, { message: string }>(
    () => {
      return axios.post("/api/games/remove-player", { gameId, userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );
  return (
    <GridActionsCellItem
      icon={<DeleteIcon />}
      label="Delete"
      onClick={() => removePlayerMutation.mutate()}
    />
  );
}

function useGameId() {
  const { id } = useParams();
  if (!id) throw new Error("game id must be defined");
  const gameId = +id;
  return gameId;
}
