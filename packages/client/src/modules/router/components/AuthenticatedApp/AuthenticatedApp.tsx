import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../../../auth/authProvider";
import {
  Admins,
  Players,
  Games,
  Game,
  Layout as AdministrationLayout,
  Settings,
  Teachers,
} from "../../../administration";
import {
  GameConsolePage,
  MyGames,
  PlayerPersonaPage,
  PlayLayout,
  PlayerActionsPage,
  PlayerStatisticsPage,
} from "../../../play";
import {
  PersonalizationLayout,
  PersonalizationChoice,
} from "../../../play/Personalization";
import { PersonalizationForm } from "../../../play/Personalization/PersonalizationForm";
import { PersonalizationPredefinedPersona } from "../../../play/Personalization/PersonalizationPredefinedPersona";
import { FormVerification } from "../../../administration/Games/Game/FormVerification";
import { RouteGuard } from "../RouteGuard";
import { gameConsoleGuard } from "../../guards/gameConsoleGuard";

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
        <Route
          path="games/:id/form-verification"
          element={<FormVerification />}
        />
        <Route path="admins" element={<Admins />} />
        <Route path="players" element={<Players />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="" element={<Navigate to="games" />} />
        <Route path="*" element={<Navigate to="games" />} />
      </Route>
      <Route path="play" element={<PlayLayout />}>
        <Route path="my-games" element={<MyGames />} />
        <Route path="games/:id" element={<PlayerPersonaPage />} />
        <Route path="games/:id/persona" element={<PlayerPersonaPage />} />
        <Route
          path="games/:id/persona/stats"
          element={<PlayerStatisticsPage />}
        />
        <Route path="games/:id/personalize" element={<PersonalizationLayout />}>
          <Route path="choice" element={<PersonalizationChoice />} />
          <Route path="form" element={<PersonalizationForm />} />
          <Route path="oilgre" element={<PersonalizationPredefinedPersona />} />
          <Route path="" element={<Navigate to="choice" />} />
        </Route>
        <Route
          path="games/:id/persona/actions"
          element={<PlayerActionsPage />}
        />
        <Route
          path="games/:id/console"
          element={<RouteGuard guard={gameConsoleGuard} />}
        >
          <Route path="" element={<GameConsolePage />} />
          <Route path="*" element={<GameConsolePage />} />
        </Route>
        <Route path="" element={<Navigate to="my-games" />} />
        <Route path="*" element={<Navigate to="my-games" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/play" />} />
    </Routes>
  );
}
