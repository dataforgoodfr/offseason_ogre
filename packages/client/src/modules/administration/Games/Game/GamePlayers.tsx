import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { IGame } from "../../../../utils/types";
import { useState } from "react";
import {
  usePlayers,
  getTeamQueryPath,
  useTeams,
  Team,
} from "./services/queries";
import { useGameId } from "./utils";

export { GamePlayers };

function GamePlayers({ game }: { game: IGame }): JSX.Element {
  const gameId = useGameId();

  const playersQuery = usePlayers(gameId);
  const teamQueryPath = getTeamQueryPath(gameId);
  const teamQuery = useTeams(teamQueryPath);

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
    teamId:
      playedGames.find(({ gameId: gId }: { gameId: number }) => gId === gameId)
        ?.team.id || 0,
  }));

  return (
    <Box style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={buildColumns({ game, teams })}
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

function buildColumns({
  game,
  teams,
}: {
  game: IGame;
  teams: Team[];
}): GridColumns<Row> {
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
    ...buildTeamColumns({ game, teams }),
    ...buildActionColumns({ game }),
  ];
}

function buildTeamColumns({
  game,
  teams,
}: {
  game: IGame;
  teams: Team[];
}): GridColumns<Row> {
  const baseTeamColumn = {
    editable: false,
    field: "teamId",
    headerName: "Equipe",
    valueFormatter: ({ value, field, api }) => {
      const colDef = api.getColumn(field);
      const option = colDef.valueOptions.find(
        ({ value: optionValue }: { value: any }) => value === optionValue
      );
      return option.label;
    },
    valueOptions: teams.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
    flex: 1,
    minWidth: 160,
  } as GridColumns<Row>[0];
  if (game.status !== "draft") {
    return [baseTeamColumn];
  }
  return [
    {
      ...baseTeamColumn,
      editable: true,
      type: "singleSelect",
    },
  ] as GridColumns<Row>;
}

function buildActionColumns({ game }: { game: IGame }): GridColumns<Row> {
  if (game.status !== "draft") {
    return [];
  }
  return [
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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => setIsDialogOpen(true)}
      />
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Voulez-vous supprimer le joueur ?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => setIsDialogOpen(false)}>
            Non
          </Button>
          <Button
            onClick={() => {
              removePlayerMutation.mutate();
              setIsDialogOpen(false);
            }}
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
