import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useQuery } from "react-query";

import { Layout } from "../administration/Layout";

export { Players };

function Players(): JSX.Element {
  return (
    <Layout>
      <>
        <Box alignItems="center" display="flex">
          <Typography variant="h3">Joueurs</Typography>
        </Box>
        <Paper sx={{ mt: 2, p: 2 }}>
          <UsersDataGrid />
        </Paper>
      </>
    </Layout>
  );
}

const columns: GridColDef<{
  lastName: string;
  firstName: string;
  email: string;
  isTeacher: boolean;
}>[] = [
  {
    field: "last-name",
    headerName: "Nom",
    valueGetter: (params) => params.row.lastName,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "first-name",
    headerName: "Prénom",
    width: 250,
    valueGetter: (params) => params.row.firstName,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "email",
    headerName: "Email",
    valueGetter: (params) => params.row.email,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "isTeacher",
    headerName: "Rôle",
    valueGetter: (params) => params.row.isTeacher,
    renderCell: function (props) {
      return props.value ? "Animateur" : "Joueur";
    },
    flex: 1,
    minWidth: 150,
  },
];

function UsersDataGrid() {
  const query = useQuery("users", () => {
    return axios.get<undefined, { data: { documents: any[] } }>(
      "/api/users?page=1&sort=email:asc"
    );
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
        pageSize={20}
        rowsPerPageOptions={[20]}
      />
    </Box>
  );
}
