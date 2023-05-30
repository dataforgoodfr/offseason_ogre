import { CircularProgress, useTheme } from "@mui/material";
import * as React from "react";
import { useQuery } from "react-query";

import { Role, RoleName, RoleNames, User } from "../users/types";
import { hasRole } from "./auth.utils";
import { http } from "../../utils/request";

export { AuthProvider, useAuth };
export type { UserPermissions };

interface IAuthContext {
  token: string | null;
  user: null | User;
  roles: Role[];
  permissions: UserPermissions;
  findRoleByName: (roleName: RoleName) => Role | undefined;
  setToken: (token: string | null) => void;
}

type UserPermissions = {
  canAccessAdminList: boolean;
  canAccessAdminPanel: boolean;
  canAccessTeacherList: boolean;
  canEditUserRole: boolean;
};

const defaultContext: IAuthContext = {
  token: localStorage.getItem("token") || null,
  user: null,
  roles: [],
  permissions: {
    canAccessAdminList: false,
    canAccessAdminPanel: false,
    canAccessTeacherList: false,
    canEditUserRole: false,
  },
  findRoleByName: () => undefined,
  setToken: () => undefined,
};

const AuthContext = React.createContext<IAuthContext>(defaultContext);
const useAuth = () => React.useContext<IAuthContext>(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState(defaultContext.token);
  const [user, setUser] = React.useState<User | null>(defaultContext.user);
  const [roles, setRoles] = React.useState<Role[]>(defaultContext.roles);

  const { isLoading: isLoadingUser } = useQuery(
    "logged-user",
    () => {
      return http.get<any, { data: { user: null | User } }>(
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
      return http.get<any, { data: { roles: Role[] } }>("/api/roles");
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

  const setTokenCallback = React.useCallback(
    (token: string | null): void => {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      setToken(token);
    },
    [setToken]
  );

  const permissions: UserPermissions = React.useMemo(
    () => ({
      canAccessAdminList: hasRole([RoleNames.ADMIN], user),
      canAccessAdminPanel: hasRole([RoleNames.ADMIN, RoleNames.TEACHER], user),
      canAccessTeacherList: hasRole([RoleNames.ADMIN], user),
      canEditUserRole: hasRole([RoleNames.ADMIN], user),
    }),
    [user]
  );

  const context = React.useMemo(
    () => ({
      token,
      user,
      roles,
      permissions,
      findRoleByName,
      setToken: setTokenCallback,
    }),
    [permissions, roles, token, user, findRoleByName, setTokenCallback]
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
