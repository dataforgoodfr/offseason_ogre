import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./modules/auth/authProvider";
import { Games } from "./modules/games";
import { Game } from "./modules/games";
import { GameConsole, MyGames } from "./modules/play";
import { PlayerPersona } from "./modules/play";
import { Stats } from "./modules/play/Stats";
import { PlayerActions } from "./modules/play/playerActions";
import { Players } from "./modules/players";
import { Settings, Teachers } from "./modules/teachers";
import { Layout as AdministrationLayout } from "./modules/administration";
import { PlayLayout } from "./modules/play/PlayLayout";

export { AuthenticatedApp };

function AuthenticatedApp() {
  const { user } = useAuth();
  if (user === null) {
    throw new Error("User must be authenticated");
  }
  return (
    <Routes>
      <Route path="administration" element={<AdministrationLayout />}>
        <Route path="games" element={<Games />} />
        <Route path="games/:id" element={<Game />} />
        <Route path="players" element={<Players />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="" element={<Navigate to="games" />} />
        <Route path="*" element={<Navigate to="games" />} />
      </Route>
      <Route path="play" element={<PlayLayout />}>
        <Route path="my-games" element={<MyGames />} />
        <Route path="games/:id" element={<PlayerPersona />} />
        <Route path="games/:id/persona" element={<PlayerPersona />} />
        <Route path="games/:id/persona/stats" element={<Stats />} />
        <Route path="games/:id/persona/actions" element={<PlayerActions />} />
        <Route path="games/:id/console" element={<GameConsole />} />
        <Route path="" element={<Navigate to="my-games" />} />
        <Route path="*" element={<Navigate to="my-games" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/play" />} />
    </Routes>
  );
}
