import {
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
import { useNavigate } from "react-router-dom";
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
import { useRemovePlayerMutation } from "./services/mutations";
import { ErrorAlert, SuccessAlert } from "../../../alert";
import { useTranslation } from "../../../translations/useTranslation";
import { I18nTranslateFunction } from "../../../translations";
import { includes, kebabCase } from "lodash";
import { pipe } from "../../../../lib/fp";
import { FormStatus } from "../../../play/Personalization/models/form";
import { http } from "../../../../utils/request";
import { Button } from "../../../common/components/Button";

export { GamePlayers };

function GamePlayers({ game }: { game: IGame }): JSX.Element {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { t } = useTranslation();
  const gameId = useGameId();

  const playersQuery = usePlayers(gameId);
  const teamQueryPath = getTeamQueryPath(gameId);
  const teamQuery = useTeams(teamQueryPath);

  const queryClient = useQueryClient();
  const { removePlayerMutation } = useRemovePlayerMutation(gameId);
  const changeTeamMutation = useMutation<
    Response,
    { message: string },
    { teamId: number; userId: number }
  >(
    ({ teamId, userId }) => {
      return http.put("/api/games/change-team", { gameId, teamId, userId });
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
      return http.put(path, { status: `${block ? "ready" : "draft"}` });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}`);
      },
    }
  );

  const retrieveEmails = () => {
    const emails = players?.map((player) => player.email) || [];
    if (emails.length > 0) {
      navigator.clipboard.writeText(emails.join(";"));
      setCopySuccess(true);
    }
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
    <>
      <Grid container gap={2}>
        <Grid container alignItems="center" justifyContent="space-between">
          {!hasGameStarted(game.status) && (
            <>
              <Button
                iconName={game?.status !== "ready" ? "lock" : "lock-open"}
                onClick={() =>
                  blockForms.mutate(game && game.status !== "ready")
                }
              >
                {game && game.status !== "ready"
                  ? t("cta.lock-forms")
                  : t("cta.unlock-forms")}
              </Button>
              <Button
                onClick={() =>
                  navigate(`/administration/games/${gameId}/form-verification`)
                }
              >
                {t("cta.check-forms")}
              </Button>
            </>
          )}
          <Button onClick={() => retrieveEmails()}>
            {t("cta.retrieve-emails")}
          </Button>
        </Grid>
        <DataGridBox>
          <DataGrid
            rows={rows}
            columns={buildColumns({
              game,
              teams,
              removePlayer: (userId: number) =>
                removePlayerMutation.mutate({ userId }),
              t,
            })}
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
      </Grid>

      {copySuccess && (
        <SuccessAlert
          message={t("message.success.admin.copied-emails")}
          onClose={() => setCopySuccess(false)}
        />
      )}
      {removePlayerMutation.isSuccess && (
        <SuccessAlert message={t("message.success.admin.player-removed")} />
      )}
      {removePlayerMutation.isError && (
        <ErrorAlert message={t("message.error.admin.global.UNEXPECTED")} />
      )}
    </>
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
  removePlayer,
  t,
}: {
  game: IGame;
  teams: Team[];
  removePlayer: (userId: number) => void;
  t: I18nTranslateFunction;
}): GridColumns<Row> {
  return [
    {
      field: "name",
      headerName: t("table.column.player-name.label"),
      valueGetter: (params) => {
        const row = params.row;
        return row.firstName + " " + row.lastName;
      },
      flex: 1,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: t("table.column.player-email.label"),
      flex: 1,
      minWidth: 250,
    },
    ...buildTeamColumns({ game, teams, t }),
    ...buildFormColumns({ t }),
    ...buildActionColumns({ game, removePlayer }),
  ];
}

function buildFormColumns({
  t,
}: {
  t: I18nTranslateFunction;
}): GridColumns<Row> {
  const baseFormColumn = {
    editable: false,
    field: "formStatus",
    headerName: t("table.column.form-status.label"),
    cellClassName: (params: GridCellParams<string>) => {
      return pipe(
        params.value || "",
        (value): FormStatus =>
          includes(["pendingValidation", "validated"], value)
            ? (value as FormStatus)
            : "draft",
        (status: FormStatus) => `form-${kebabCase(status)}`
      );
    },
    renderCell: ({ value }) => {
      const formStatus = pipe(
        value || "",
        (value): FormStatus | "unfilled" =>
          includes(["draft", "pendingValidation", "validated"], value)
            ? (value as FormStatus)
            : "unfilled",
        kebabCase
      );

      return (
        <>
          <Icon name={`form-${formStatus}` as any} sx={{ mr: 1 }} />{" "}
          {t(`admin.form.status.${formStatus}` as any)}
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
  t,
}: {
  game: IGame;
  teams: Team[];
  t: I18nTranslateFunction;
}): GridColumns<Row> {
  const baseTeamColumn = {
    editable: false,
    field: "teamId",
    headerName: t("table.column.player-team.label"),
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

function buildActionColumns({
  game,
  removePlayer,
}: {
  game: IGame;
  removePlayer: (userId: number) => void;
}): GridColumns<Row> {
  if (hasGameStarted(game.status)) {
    return [];
  }
  return [
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params: GridRowParams<Row>) => [
        <DeleteActionCellItem params={params} removePlayer={removePlayer} />,
      ],
    },
  ];
}

function DeleteActionCellItem({
  params,
  removePlayer,
}: {
  params: GridRowParams<Row>;
  removePlayer: (userId: number) => void;
}) {
  const { t } = useTranslation();

  const userId = params.row.id;
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
          {t("modal.remove-player.title")}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>{t("cta.no")}</Button>
          <Button
            onClick={() => {
              removePlayer(userId);
              setIsDialogOpen(false);
            }}
          >
            {t("cta.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
