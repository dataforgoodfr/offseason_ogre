import { Box, CircularProgress, Typography } from "@mui/material";
import { Layout } from "../administration/Layout";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useQuery } from "react-query";

export { Games };

function Games(): JSX.Element {
  return (
    <Layout>
      <>
        <Typography variant="h3">Games</Typography>
        <Box sx={{ mt: 2 }}>
          <GamesDataGrid />
        </Box>
      </>
    </Layout>
  );
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Nom",
    width: 150,
  },
];

function GamesDataGrid() {
  const query = useQuery("games", () => {
    return axios.get<undefined, { data: { documents: any[] } }>("/api/games");
  });

  if (query.isLoading) {
    return <CircularProgress />;
  }

  const rows = query?.data?.data?.documents ?? [];
  console.log("rows", rows);
  console.log("query.data", query.data);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
        disableSelectionOnClick
      />
    </div>
  );
}
