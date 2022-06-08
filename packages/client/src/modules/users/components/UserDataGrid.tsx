import { Box, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridFilterItem } from "@mui/x-data-grid";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { IUser } from "../../../utils/types";
import { SuccessAlert } from "../../alert";

export { UsersDataGrid };

function UsersDataGrid({
  defaultFilterItems = [],
}: {
  defaultFilterItems?: GridFilterItem[];
}) {
  // TODO: perform sorting and pagination on server side after v1.
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
          columns={buildColumns()}
          initialState={{
            filter: {
              filterModel: {
                items: defaultFilterItems,
              },
            },
          }}
          disableSelectionOnClick
          pageSize={20}
          rowsPerPageOptions={[20]}
          onCellEditCommit={handleCellEditCommit}
        />
      </Box>
    </>
  );
}

function buildColumns(): GridColDef<{
  lastName: string;
  firstName: string;
  email: string;
  country: string;
  isTeacher: boolean;
}>[] {
  return [
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
      field: "country",
      headerName: "Pays",
      valueGetter: (params) => params.row.country,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "isTeacher",
      headerName: "Animateur",
      editable: true,
      type: "boolean",
      valueGetter: (params) => params.row.isTeacher,
      flex: 1,
      minWidth: 150,
    },
  ];
}
