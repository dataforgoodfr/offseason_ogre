import { CircularProgress } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";
import { theme } from "../../utils/theme";
import { User } from "../users/types";

export { AuthProvider, useAuth };

const AuthContext = React.createContext<{ user: null | User }>({ user: null });
const useAuth = () => React.useContext<{ user: null | User }>(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const query = useQuery("logged-user", () => {
    return axios.get<any, { data: { user: null | User } }>(
      "/api/users/logged-user"
    );
  });

  if (query.isLoading) {
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
    <AuthContext.Provider value={{ user: query.data?.data?.user || null }}>
      {children}
    </AuthContext.Provider>
  );
}
