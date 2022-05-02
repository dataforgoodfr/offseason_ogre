import { CircularProgress } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { theme } from "../../utils/theme";
import { User } from "../users/types";

export { AuthProvider, useAuth };

const AuthContext = React.createContext<{ user: null | User }>({ user: null });
const useAuth = () => React.useContext<{ user: null | User }>(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<null | User>(null);

  React.useEffect(() => {
    axios.get("/api/users/logged-user").then((res) => {
      setUser(res.data.user);
      setIsLoading(false);
    });
  }, []);

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
