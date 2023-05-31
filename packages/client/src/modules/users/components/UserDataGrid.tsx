import { Box, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridFilterItem } from "@mui/x-data-grid";
import { useMutation, useQuery } from "react-query";
import { findColumnOption } from "../../../lib/mui";
import { ErrorAlert, SuccessAlert } from "../../alert";
import { useAuth, UserPermissions } from "../../auth/authProvider";
import { t } from "../../translations";
import { Role } from "../types";
import { http } from "../../../utils/request";

export { UsersDataGrid };

type GridRow = {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  country: string;
  roleId: number;
};

function UsersDataGrid({
  defaultFilterItems = [],
}: {
  defaultFilterItems?: GridFilterItem[];
}) {
  const { permissions, roles } = useAuth();

  // TODO: perform sorting and pagination on server side after v1.
  const queryUsers = useQuery("users", () => {
    return http.get<undefined, { data: { documents: any[] } }>(
      "/api/users?page=1&sort=email:asc"
    );
  });

  const mutateUser = useMutation((user: GridRow) => {
    const path = `/api/users/${user.id}`;
    return http.put(path, user);
  });

  const handleCellEdit = (
    newRow: GridRow,
    oldRow: GridRow
  ): Promise<GridRow> => {
    return new Promise((resolve) => {
      mutateUser.mutate(newRow, {
        onSuccess: () => resolve(newRow),
        onError: () => resolve(oldRow),
      });
    });
  };

  if (queryUsers.isLoading) {
    return <CircularProgress />;
  }

  const rows = queryUsers?.data?.data?.documents ?? [];

  return (
    <>
      {mutateUser.isSuccess && <SuccessAlert />}
      {mutateUser.isError && (
        <ErrorAlert message={t("message.error.admin.global.UNEXPECTED")} />
      )}

      <Box style={{ height: 600, width: "100%", cursor: "pointer" }}>
        <DataGrid
          rows={rows}
          columns={buildColumns({ permissions, availableRoles: roles })}
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
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={handleCellEdit}
        />
      </Box>
    </>
  );
}

function buildColumns({
  permissions,
  availableRoles,
}: {
  permissions: UserPermissions;
  availableRoles: Role[];
}): GridColDef<GridRow>[] {
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
      field: "roleId",
      headerName: "Role",
      valueFormatter: ({ value, field, api }) =>
        findColumnOption(api, field, value)?.label,
      valueOptions: availableRoles.map((role) => ({
        value: role.id,
        label: t(`role.${role.name}` as any),
      })),
      flex: 1,
      minWidth: 150,
      editable: permissions.canEditUserRole,
      type: "singleSelect",
    },
  ];
}
