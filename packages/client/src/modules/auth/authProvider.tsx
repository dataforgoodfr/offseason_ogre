import { CircularProgress, useTheme } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";

import { Role, User } from "../users/types";

export { AuthProvider, useAuth };

interface IAuthContext {
  user: null | User;
  isAdmin: boolean;
  roles: Role[];
}

const AuthContext = React.createContext<IAuthContext>({
  user: null,
  isAdmin: false,
  roles: [],
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

  const context = React.useMemo(
    () => ({
      user,
      isAdmin: user?.role.name === "admin",
      roles,
    }),
    [roles, user]
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
