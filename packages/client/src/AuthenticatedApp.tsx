import { Route, Routes } from "react-router-dom";
import { NewGame } from "./modules/administration";
import { useAuth } from "./modules/auth/authProvider";

export { AuthenticatedApp };

function AuthenticatedApp() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={<div>Congratz you are logged in as {user?.email}!</div>}
      />
      <Route path="administration">
        <Route path="new-game" element={<NewGame />} />
      </Route>
    </Routes>
  );
}
