import { CircularProgress, useTheme } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";

import { User } from "../users/types";

export { AuthProvider, useAuth };

interface IAuthContext {
  user: null | User;
}

const AuthContext = React.createContext<IAuthContext>({
  user: null,
});
const useAuth = () => React.useContext<IAuthContext>(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  const { isLoading } = useQuery(
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
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
