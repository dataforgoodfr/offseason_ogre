import { Navigate, Route, Routes } from "react-router-dom";
import { NewGame } from "./modules/administration";
import { useAuth } from "./modules/auth/authProvider";
import { Games } from "./modules/games";
import { Game } from "./modules/games";
import { MyGames } from "./modules/play";
import { PlayerPersona } from "./modules/play/PlayerPersona";

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
        <Route path="games/new" element={<NewGame />} />
        <Route path="games/:id" element={<Game />} />
        <Route path="" element={<Navigate to="games" />} />
        <Route path="*" element={<Navigate to="games" />} />
      </Route>
      <Route path="play">
        <Route path="my-games" element={<MyGames />} />
        <Route path="my-games/:id" element={<PlayerPersona />} />
        <Route path="my-games/:id/persona" element={<PlayerPersona />} />
        <Route path="" element={<Navigate to="my-games" />} />
        <Route path="*" element={<Navigate to="my-games" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/play" />} />
    </Routes>
  );
}
