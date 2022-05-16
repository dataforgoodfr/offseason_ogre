import { Navigate, Route, Routes } from "react-router-dom";
import { NewGame } from "./modules/administration";
import { useAuth } from "./modules/auth/authProvider";
import { Games } from "./modules/games";
import { GameDetail } from "./modules/games";
import { MyGames } from "./modules/play";

export { AuthenticatedApp };

function AuthenticatedApp() {
  const { user } = useAuth();
  if (user === null) {
    throw new Error("User must be authenticated");
  }
  return (
    <Routes>
      <Route path="administration">
        <Route path="new-game" element={<NewGame />} />
        <Route path="games" element={<Games />} />
        <Route path="games/:id" element={<GameDetail />} />
        <Route path="" element={<Navigate to="games" />} />
        <Route path="*" element={<Navigate to="games" />} />
      </Route>
      <Route path="play">
        <Route path="my-games" element={<MyGames />} />
        <Route path="" element={<Navigate to="my-games" />} />
        <Route path="*" element={<Navigate to="my-games" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/play" />} />
    </Routes>
  );
}
