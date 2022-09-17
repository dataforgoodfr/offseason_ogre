import { CircularProgress, useTheme } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";

import { User } from "../users/types";

export { AuthProvider, useAuth };

const AuthContext = React.createContext<{
  user: null | User;
}>({ user: null });
const useAuth = () => React.useContext<{ user: null | User }>(AuthContext);

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
    }
  );

  const theme = useTheme();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <CircularProgress color="secondary" sx={{ margin: "auto" }} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
