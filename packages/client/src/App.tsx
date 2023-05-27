import { AuthenticatedApp } from "./AuthenticatedApp";
import { useAuth } from "./modules/auth/authProvider";
import { UnauthenticatedApp } from "./UnauthenticatedApp";
import { hotjar } from "react-hotjar";
import { useEffect } from "react";
import { ErrorBoundary } from "./modules/error-handling/ErrorBoundary";
import { Alerts } from "./modules/alert";

export default App;

function App() {
  useEffect(() => {
    hotjar.initialize(3215542, 6);
  }, []);

  const { user } = useAuth();

  return (
    <ErrorBoundary>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      <Alerts />
    </ErrorBoundary>
  );
}
