import {
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
  GridCellParams,
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
import { hasGameStarted } from "../utils";
import { Icon } from "../../../common/components/Icon";
import { DataGridBox } from "./GameTeams.styles";
import { FormVerification } from "./FormVerification";
import { Game } from "../types";

export { GamePlayers };

function GamePlayers({ game }: { game: IGame }): JSX.Element {
  const [openFormValidation, setOpenFormValidation] = useState<boolean>(false);

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

  const blockForms = useMutation<Response, { message: string }, any>(
    (block: boolean) => {
      const path = `/api/games/${game.id}`;
      return axios.put(path, { status: `${block ? "ready" : "draft"}` });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}`);
      },
    }
  );

  const isOpen = (game: Game) => {
    return game && game.status !== "ready";
  };

  if (playersQuery.isLoading || teamQuery.isLoading) {
    return <CircularProgress />;
  }

  const players = playersQuery?.data?.data?.players ?? [];
  const teams = teamQuery?.data?.data?.teams ?? [];

  const rows = players.map(({ playedGames, ...player }) => {
    const currentGame = playedGames.find(
      ({ gameId: gId }: { gameId: number }) => gId === gameId
    );
    return {
      ...player,
      teamId: currentGame?.team.id || 0,
      formStatus: currentGame?.profile?.status || "noProfile",
    };
  });

  return (
    <Grid container>
      {!hasGameStarted(game.status) && (
        <>
          <Grid
            container
            alignItems="center"
            sx={{ float: "right", pb: 2, pt: 2, height: "100%" }}
          >
            <Button
              onClick={() => blockForms.mutate(isOpen(game))}
              variant="contained"
              sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
            >
              <Icon name={isOpen(game) ? "lock" : "lock-open"} sx={{ mr: 2 }} />{" "}
              {`${
                isOpen(game) ? "Verrouiller" : "Déverouiller"
              } les formulaires`}
            </Button>
            <Button
              onClick={() => setOpenFormValidation(true)}
              variant="contained"
              sx={{ marginRight: "auto", ml: 2, height: "80%" }}
            >
              Vérifier les formulaires
            </Button>
          </Grid>
        </>
      )}
      <DataGridBox>
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
      </DataGridBox>
      <FormVerification
        openFormValidation={openFormValidation}
        setOpenFormValidation={setOpenFormValidation}
      />
    </Grid>
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
    ...buildFormColumns(),
    ...buildActionColumns({ game }),
  ];
}

function buildFormColumns(): GridColumns<Row> {
  const baseFormColumn = {
    editable: false,
    field: "formStatus",
    headerName: "Statut du formulaire",
    cellClassName: (params: GridCellParams<string>) => {
      if (params.value === "pendingValidation") return "form-to-validate";
      if (params.value === "validated") return "form-validated";
      return "form-draft";
    },
    renderCell: ({ value }) => {
      if (value === "draft") {
        return (
          <>
            <Icon name="draft" sx={{ mr: 1 }} /> Brouillon
          </>
        );
      }
      if (value === "validated") {
        return (
          <>
            <Icon name="check-circle" sx={{ mr: 1 }} /> Validé
          </>
        );
      }
      if (value === "pendingValidation") {
        return (
          <>
            <Icon name="settings" sx={{ mr: 1 }} /> En attente de validation
          </>
        );
      }
      return (
        <>
          <Icon name="mark-circle" sx={{ mr: 1 }} /> Non rempli
        </>
      );
    },
    flex: 1,
    minWidth: 160,
  } as GridColumns<Row>[0];
  return [baseFormColumn];
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
  if (hasGameStarted(game.status)) {
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
  if (hasGameStarted(game.status)) {
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
