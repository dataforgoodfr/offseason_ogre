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

export { Games };

function Games(): JSX.Element {
  return (
    <>
      <Box alignItems="center" display="flex">
        <Typography variant="h3">Ateliers</Typography>
        <NewGame />
      </Box>
      <Paper sx={{ mt: 2, p: 2 }}>
        <GamesDataGrid />
      </Paper>
    </>
  );
}

const columns: GridColDef<{ date: string; teacher: { email: string } }>[] = [
  { field: "id", headerName: "ID", width: 80 },
  {
    field: "code",
    headerName: "Code",
    width: 120,
    renderCell: (params: GridRenderCellParams<string>) => {
      return (
        <CopyToClipboard className="w-full h-full" value={params.value || ""} />
      );
    },
  },
  {
    field: "name",
    headerName: "Nom",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "teacher",
    headerName: "Animateur",
    width: 250,
    valueGetter: (params) => params.row.teacher.email,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "date",
    headerName: "Date",
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
];

function GamesDataGrid() {
  const navigate = useNavigate();
  const query = useQuery("games", () => {
    return axios.get<undefined, { data: { documents: any[] } }>("/api/games");
  });

  if (query.isLoading) {
    return <CircularProgress />;
  }

  const rows = query?.data?.data?.documents ?? [];

  return (
    <Box style={{ height: 600, width: "100%", cursor: "pointer" }}>
      <DataGrid
        rows={rows}
        columns={columns}
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
        <AddBoxIcon sx={{ mr: 1 }} /> Nouveau Jeu
      </Button>
    </>
  );
}
