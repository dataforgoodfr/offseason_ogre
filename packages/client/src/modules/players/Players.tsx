import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  DataGrid,
  GridRenderCellParams,
  GridColDef,
  useGridApiContext,
} from "@mui/x-data-grid";
import axios from "axios";
import { useMutation, useQuery } from "react-query";

import { IUser } from "../../utils/types";
import { Layout } from "../administration/Layout";
import { SuccessAlert } from "../alert";

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

function renderPlayerRoleCell(props: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{props.value ? "Animateur" : "Joueur"}</span>
      <ArrowDropDown sx={{ fontSize: "1.2rem" }} />
    </Box>
  );
}

function PlayerRoleEditInputCell(props: GridRenderCellParams<boolean>) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value === "true";
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Box sx={{ display: "flex", flex: 1, alignItems: "center" }}>
      <Select sx={{ flex: 1 }} value={String(value)} onChange={handleChange}>
        <MenuItem value="true">Animateur</MenuItem>
        <MenuItem value="false">Joueur</MenuItem>
      </Select>
    </Box>
  );
}

const renderPlayerRoleEditInputCell: GridColDef["renderCell"] = (params) => {
  return <PlayerRoleEditInputCell {...params} />;
};

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
    editable: true,
    type: "boolean",
    valueGetter: (params) => params.row.isTeacher,
    renderCell: renderPlayerRoleCell,
    renderEditCell: renderPlayerRoleEditInputCell,
    flex: 1,
    minWidth: 150,
  },
];

function UsersDataGrid() {
  const queryUsers = useQuery("users", () => {
    return axios.get<undefined, { data: { documents: any[] } }>(
      "/api/users?page=1&sort=email:asc"
    );
  });

  const mutateUser = useMutation((user: IUser) => {
    const path = `/api/users/${user.id}`;
    return axios.put(path, user);
  });

  const handleCellEditCommit = (params: any) => {
    const newValue = { ...params.row, [params.field]: params.value };
    mutateUser.mutate(newValue);
  };

  if (queryUsers.isLoading) {
    return <CircularProgress />;
  }

  const rows = queryUsers?.data?.data?.documents ?? [];

  return (
    <>
      {mutateUser.isSuccess && <SuccessAlert />}

      <Box style={{ height: 600, width: "100%", cursor: "pointer" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          pageSize={20}
          rowsPerPageOptions={[20]}
          onCellEditCommit={handleCellEditCommit}
        />
      </Box>
    </>
  );
}
