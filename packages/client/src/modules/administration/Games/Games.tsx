import { Box, CircularProgress, Paper } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "../../alert";
import { CopyToClipboard } from "../../common/components/CopyToClipboard";
import { IGameWithTeacher } from "../../../utils/types";
import { I18nTranslateFunction } from "../../translations";
import { useTranslation } from "../../translations/useTranslation";
import { http } from "../../../utils/request";
import { Icon } from "../../common/components/Icon";
import { useRemoveGameMutation } from "./Game/services/mutations";
import { useCallback, useState } from "react";
import { Dialog } from "../../common/components/Dialog";
import { Button } from "../../common/components/Button";
import { Typography } from "../../common/components/Typography";
import { useDialog } from "../../common/hooks/useDialog";

export { Games };

function Games(): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Typography variant="h3">{t("page.admin.games.title")}</Typography>
        <NewGame />
      </Box>
      <Paper sx={{ mt: 2, p: 2 }}>
        <GamesDataGrid />
      </Paper>
    </>
  );
}

const buildColumns = ({
  idOfGameBeingRemoved,
  removeGame,
  t,
}: {
  idOfGameBeingRemoved?: number;
  removeGame: (gameId: number) => void;
  t: I18nTranslateFunction;
}): GridColumns<IGameWithTeacher> => [
  { field: "id", headerName: t("table.column.game-id.label"), width: 80 },
  {
    field: "code",
    headerName: t("table.column.game-code.label"),
    width: 120,
    renderCell: (params: GridRenderCellParams<string>) => {
      return (
        <CopyToClipboard className="w-full h-full" value={params.value || ""} />
      );
    },
  },
  {
    field: "name",
    headerName: t("table.column.game-name.label"),
    flex: 1,
    minWidth: 150,
  },
  {
    field: "teacher",
    headerName: t("table.column.game-teacher.label"),
    width: 250,
    valueGetter: (params) => params.row.teacher.email,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "date",
    headerName: t("table.column.game-date.label"),
    type: "dateTime",
    renderCell: (params: GridRenderCellParams<string>) => {
      return new Date(params.row.date).toLocaleString([], {
        dateStyle: "short",
        timeStyle: "short",
      });
    },
    flex: 1,
    minWidth: 150,
  },
  {
    field: "status",
    headerName: t("table.column.game-status.label"),
    valueGetter: (params) => t(`game.status.${params.row.status}`),
    flex: 1,
    minWidth: 150,
  },
  {
    field: "actions",
    type: "actions",
    headerName: t("table.column.actions.label"),
    width: 80,
    getActions: (params: GridRowParams<IGameWithTeacher>) => [
      <GridActionsCellItem
        icon={<Icon name="delete" />}
        label={`Delete game ${params.row.name}`}
        onClick={() => removeGame(params.row.id)}
        disabled={idOfGameBeingRemoved === params.row.id}
      />,
    ],
  },
];

function GamesDataGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [idOfGameToRemove, setIdOfGameToRemove] = useState<number | null>(null);
  const {
    isOpen: isRemoveGameDialogOpen,
    openDialog: openRemoveGameDialog,
    closeDialog: closeRemoveGameDialog,
  } = useDialog();

  const query = useQuery("games", () => {
    return http.get<undefined, { data: { documents: any[] } }>("/api/games");
  });
  const { removeGameMutation } = useRemoveGameMutation();

  const onRemoveGame = useCallback(
    (gameId: number) => {
      setIdOfGameToRemove(gameId);
      openRemoveGameDialog();
    },
    [openRemoveGameDialog, setIdOfGameToRemove]
  );

  const removeGame = useCallback(() => {
    if (idOfGameToRemove != null) {
      removeGameMutation.mutate({ gameId: idOfGameToRemove });
    }
  }, [idOfGameToRemove, removeGameMutation]);

  if (query.isLoading) {
    return <CircularProgress />;
  }

  const rows: IGameWithTeacher[] = query?.data?.data?.documents ?? [];

  return (
    <>
      <Box style={{ height: 600, width: "100%", cursor: "pointer" }}>
        <DataGrid
          rows={rows}
          columns={buildColumns({
            idOfGameBeingRemoved: removeGameMutation.variables?.gameId,
            removeGame: onRemoveGame,
            t,
          })}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: "date", sort: "desc" }],
            },
          }}
          pageSize={20}
          rowsPerPageOptions={[20]}
          onRowClick={(rowData) => {
            const path = rowData.id
              ? `/administration/games/${rowData.id}`
              : "/administration/games/";
            return navigate(path);
          }}
        />
      </Box>
      <Dialog
        open={isRemoveGameDialogOpen}
        content={
          <Typography>
            {t("modal.remove-game.title", { game: idOfGameToRemove })}
          </Typography>
        }
        actions={
          <>
            <Button type="secondary" onClick={closeRemoveGameDialog}>
              {t("cta.cancel")}
            </Button>
            <Button
              onClick={() => {
                removeGame();
                closeRemoveGameDialog();
              }}
            >
              {t("cta.delete")}
            </Button>
          </>
        }
        handleClose={closeRemoveGameDialog}
      />
    </>
  );
}

function NewGame() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutation = useMutation<Response, { message: string }>(
    (newGame) => {
      return http.post("/api/games", newGame);
    },
    {
      onSuccess: () => queryClient.invalidateQueries("games"),
    }
  );

  return (
    <>
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      {mutation.isSuccess && <SuccessAlert />}
      <Button iconName="create" onClick={() => mutation.mutate()}>
        {t("cta.create-game")}
      </Button>
    </>
  );
}
