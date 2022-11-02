import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
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
import { TeamTextField } from "./GameTeams.styles";
import { NO_TEAM } from "../../../common/constants/teams";
import { usePlayers, getTeamQueryPath, useTeams } from "./services/queries";
import { useGameId } from "./utils";

export { GameTeams };

function GameTeams({ game }: { game: IGame }): JSX.Element {
  const gameId = useGameId();

  const [teamsQuantity, setTeamsQuantity] = useState<number>(1);

  const playersQuery = usePlayers(gameId);
  const teamQueryPath = getTeamQueryPath(gameId);
  const teamQuery = useTeams(teamQueryPath);

  const queryClient = useQueryClient();

  const createTeamsMutation = useMutation<
    Response,
    { message: string },
    { quantity: number }
  >(
    ({ quantity }) => {
      return axios.post(`/api/teams`, { gameId, quantity });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
        queryClient.invalidateQueries(teamQueryPath);
      },
    }
  );

  const orderPlayersMutation = useMutation<Response, { message: string }>(
    () => {
      return axios.put(`/api/games/${gameId}/players/order`, { gameId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
        queryClient.invalidateQueries(teamQueryPath);
      },
    }
  );

  const handleChange = (e: any) => {
    setTeamsQuantity(e.target.value);
  };

  if (playersQuery.isLoading || teamQuery.isLoading) {
    return <CircularProgress />;
  }

  const players = playersQuery?.data?.data?.players ?? [];
  const teams = teamQuery?.data?.data?.teams ?? [];

  const rows = teams.map((team) => {
    const playersWithTeams = players.map(({ playedGames, ...player }) => {
      const teamId = playedGames.find(
        ({ gameId: gId }: { gameId: number }) => gId === gameId
      )?.team.id;
      return { playerId: player.id, teamId: teamId };
    });
    return {
      id: team.id,
      name: team.name,
      numberOfPlayers: playersWithTeams.filter(
        ({ teamId }) => teamId === team.id
      ).length,
    };
  });

  return (
    <>
      <Box style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={buildColumns({ game })}
          disableSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[10]}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      {game.status === "draft" && (
        <>
          <Grid
            container
            alignItems="center"
            sx={{ float: "left", pb: 2, pt: 2 }}
          >
            <TeamTextField
              sx={{ textAlign: "center", ml: 2, mr: 2 }}
              id="outlined-number"
              label="Nombre d'équipes"
              type="number"
              value={teamsQuantity}
              onChange={handleChange}
            />
            <Button
              onClick={() =>
                createTeamsMutation.mutate({ quantity: Number(teamsQuantity) })
              }
              variant="contained"
              sx={{ marginRight: "auto", ml: 2, height: "80%" }}
            >
              Ajouter des équipes
            </Button>
          </Grid>
          <Grid container alignItems="center" sx={{ pb: 2, pt: 2 }}>
            <Button
              onClick={() => orderPlayersMutation.mutate()}
              variant="contained"
              sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
            >
              Répartir aléatoirement les joueurs
            </Button>
          </Grid>
        </>
      )}
    </>
  );
}

interface Row {
  id: number;
  name: string;
  numberOfPlayers: number;
}

function buildColumns({ game }: { game: IGame }): GridColumns<Row> {
  return [
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "numberOfPlayers",
      headerName: "Nombre de joueurs",
      flex: 1,
      minWidth: 250,
    },
    ...buildActionColumns({ game }),
  ];
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
      getActions: (params: GridRowParams<Row>) =>
        params.row.name !== NO_TEAM
          ? [<DeleteActionCellItem params={params} />]
          : [],
    },
  ];
}

function DeleteActionCellItem({ params }: { params: GridRowParams<Row> }) {
  const queryClient = useQueryClient();
  const gameId = useGameId();
  const teamId = params.row.id;
  const removeTeamMutation = useMutation<Response, { message: string }>(
    () => {
      return axios.post("/api/games/remove-team", { gameId, teamId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
        queryClient.invalidateQueries(
          `/api/teams?${new URLSearchParams({
            gameId: `${gameId}`,
          })}`
        );
      },
    }
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      {}
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
          Voulez-vous supprimer l'équipe ?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => setIsDialogOpen(false)}>
            Non
          </Button>
          <Button
            onClick={() => {
              removeTeamMutation.mutate();
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
