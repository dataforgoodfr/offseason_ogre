import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "../../alert";
import { CopyToClipboard } from "../../common/components/CopyToClipboard";
import { IGameWithTeacher } from "../../../utils/types";
import { I18nTranslateFunction } from "../../translations";
import { useTranslation } from "../../translations/useTranslation";

export { Games };

function Games(): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <Box alignItems="center" display="flex">
        <Typography variant="h3">{t("page.admin.games.title")}</Typography>
        <NewGame />
      </Box>
      <Paper sx={{ mt: 2, p: 2 }}>
        <GamesDataGrid />
      </Paper>
    </>
  );
}

const buildColumns: (args: {
  t: I18nTranslateFunction;
}) => GridColDef<IGameWithTeacher>[] = ({ t }) => [
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
];

function GamesDataGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const query = useQuery("games", () => {
    return axios.get<undefined, { data: { documents: any[] } }>("/api/games");
  });

  if (query.isLoading) {
    return <CircularProgress />;
  }

  const rows: IGameWithTeacher[] = query?.data?.data?.documents ?? [];

  return (
    <Box style={{ height: 600, width: "100%", cursor: "pointer" }}>
      <DataGrid
        rows={rows}
        columns={buildColumns({ t })}
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
  );
}

function NewGame() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutation = useMutation<Response, { message: string }>(
    (newGame) => {
      return axios.post("/api/games", newGame);
    },
    {
      onSuccess: () => queryClient.invalidateQueries("games"),
    }
  );

  return (
    <>
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      {mutation.isSuccess && <SuccessAlert />}
      <Button
        onClick={() => mutation.mutate()}
        variant="contained"
        sx={{ marginLeft: "auto" }}
      >
        <AddBoxIcon sx={{ mr: 1 }} /> {t("cta.create-game")}
      </Button>
    </>
  );
}
