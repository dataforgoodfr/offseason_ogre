import { CircularProgress, useTheme } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useQuery } from "react-query";

import { User } from "../users/types";

export { AuthProvider, useAuth };

const AuthContext = React.createContext<{
  user: null | User;
  refetchUser: () => Promise<void>;
}>({ user: null, refetchUser: () => Promise.resolve() });
const useAuth = () =>
  React.useContext<{ user: null | User; refetchUser: () => Promise<void> }>(
    AuthContext
  );

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  const query = useQuery("logged-user", () => {
    return axios.get<any, { data: { user: null | User } }>(
      "/api/users/logged-user"
    );
  });

  React.useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data?.data?.user || null);
    }
  }, [query]);

  const theme = useTheme();

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

  const refetchUser = async () => {
    await query.refetch();
  };

  return (
    <AuthContext.Provider value={{ user, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
