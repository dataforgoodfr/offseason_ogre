import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./modules/auth/authProvider";
import { Games } from "./modules/games";
import { Game } from "./modules/games";
import { GameAdmin, MyGames } from "./modules/play";
import { PlayerPersona } from "./modules/play";

export { AuthenticatedApp };

function AuthenticatedApp() {
  const { user } = useAuth();
  if (user === null) {
    throw new Error("User must be authenticated");
  }
  return (
    <Routes>
      <Route path="administration">
        <Route path="games" element={<Games />} />
        <Route path="games/:id" element={<Game />} />
        <Route path="" element={<Navigate to="games" />} />
        <Route path="*" element={<Navigate to="games" />} />
      </Route>
      <Route path="play">
        <Route path="my-games" element={<MyGames />} />
        <Route path="games/:id" element={<PlayerPersona />} />
        <Route path="games/:id/persona" element={<PlayerPersona />} />
        <Route path="games/:id/admin" element={<GameAdmin />} />
        <Route path="" element={<Navigate to="my-games" />} />
        <Route path="*" element={<Navigate to="my-games" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/play" />} />
    </Routes>
  );
}
