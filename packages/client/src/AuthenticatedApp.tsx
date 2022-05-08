import { Navigate, Route, Routes } from "react-router-dom";
import { NewGame } from "./modules/administration";
import { Games } from "./modules/games";

export { AuthenticatedApp };

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="administration">
        <Route path="new-game" element={<NewGame />} />
        <Route path="games" element={<Games />} />
      </Route>
      <Route
        path="*"
        element={<Navigate replace to="/administration/games" />}
      />
    </Routes>
  );
}
