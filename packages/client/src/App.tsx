import { AuthenticatedApp } from "./AuthenticatedApp";
import { useAuth } from "./modules/auth/authProvider";
import { UnauthenticatedApp } from "./UnauthenticatedApp";

export default App;

function App() {
  const { user } = useAuth();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}
