import { CircularProgress, useTheme } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";

import { Role, RoleName, RoleNames, User } from "../users/types";
import { hasRole } from "./auth.utils";

export { AuthProvider, useAuth };
export type { UserPermissions };

interface IAuthContext {
  user: null | User;
  roles: Role[];
  permissions: UserPermissions;
  findRoleByName: (roleName: RoleName) => Role | undefined;
}

type UserPermissions = {
  canAccessAdminPanel: boolean;
  canEditUserRole: boolean;
};

const AuthContext = React.createContext<IAuthContext>({
  user: null,
  roles: [],
  permissions: {
    canAccessAdminPanel: false,
    canEditUserRole: false,
  },
  findRoleByName: () => undefined,
});
const useAuth = () => React.useContext<IAuthContext>(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);

  const { isLoading: isLoadingUser } = useQuery(
    "logged-user",
    () => {
      return axios.get<any, { data: { user: null | User } }>(
        "/api/users/logged-user"
      );
    },
    {
      onSuccess: (data) => {
        setUser(data?.data?.user || null);
      },
      onError: () => {
        setUser(null);
      },
    }
  );

  const { isLoading: isLoadingRoles } = useQuery(
    "roles",
    () => {
      return axios.get<any, { data: { roles: Role[] } }>("/api/roles");
    },
    {
      onSuccess: (data) => {
        setRoles(data?.data?.roles);
      },
      onError: () => {
        setRoles([]);
      },
    }
  );

  const findRoleByName = React.useCallback(
    (roleName: RoleName): Role | undefined => {
      return roles.find((role) => role.name === roleName);
    },
    [roles]
  );

  const permissions: UserPermissions = React.useMemo(
    () => ({
      canAccessAdminPanel: hasRole([RoleNames.ADMIN, RoleNames.TEACHER], user),
      canEditUserRole: hasRole([RoleNames.ADMIN], user),
    }),
    [user]
  );

  const context = React.useMemo(
    () => ({
      user,
      roles,
      permissions,
      findRoleByName,
    }),
    [permissions, roles, user, findRoleByName]
  );

  if (isLoadingUser || isLoadingRoles) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

function Loading() {
  const theme = useTheme();
  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <CircularProgress color="secondary" sx={{ margin: "auto" }} />
    </div>
  );
}
