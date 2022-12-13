import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./modules/auth/authProvider";
import {
  Players,
  Games,
  Game,
  Layout as AdministrationLayout,
  Settings,
  Teachers,
} from "./modules/administration";
import {
  GameConsoleView,
  MyGames,
  PlayerPersona,
  PlayLayout,
  PlayerActionsPage,
  Stats,
} from "./modules/play";
import { PersonalizationChoice } from "./modules/play/Personalization";
import { PersonalizationForm } from "./modules/play/Personalization/PersonalizationForm";
import { PersonalizationPredefinedPersona } from "./modules/play/Personalization/PersonalizationPredefinedPersona";

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
        <Route
          path="games/:id/personalize"
          element={<PersonalizationChoice />}
        />
        <Route
          path="games/:id/personalize/choice"
          element={<PersonalizationChoice />}
        />
        <Route
          path="games/:id/personalize/form"
          element={<PersonalizationForm />}
        />
        <Route
          path="games/:id/personalize/oilgre"
          element={<PersonalizationPredefinedPersona />}
        />
        <Route
          path="games/:id/persona/actions"
          element={<PlayerActionsPage />}
        />
        <Route path="games/:id/console" element={<GameConsoleView />} />
        <Route path="" element={<Navigate to="my-games" />} />
        <Route path="*" element={<Navigate to="my-games" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/play" />} />
    </Routes>
  );
}
