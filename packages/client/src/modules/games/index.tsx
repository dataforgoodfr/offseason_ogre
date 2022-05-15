import { Box, CircularProgress, Typography } from "@mui/material";
import { Layout } from "../administration/Layout";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useQuery } from "react-query";
import { GameDetail } from "./GameDetail";
import { useNavigate } from "react-router-dom";

export { Games, GameDetail };

function Games(): JSX.Element {
  return (
    <Layout>
      <>
        <Typography variant="h3">Ateliers</Typography>
        <Box sx={{ mt: 2 }}>
          <GamesDataGrid />
        </Box>
      </>
    </Layout>
  );
}

const columns: GridColDef<{ date: string; teacher: { email: string } }>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Nom",
    width: 150,
  },
  {
    field: "teacher",
    headerName: "Animateur",
    width: 250,
    valueGetter: (params) => params.row.teacher.email,
  },
  {
    field: "date",
    headerName: "Date",
    type: "dateTime",
    valueGetter: (params) => {
      return new Date(params.row.date).toLocaleString();
    },
    width: 200,
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
