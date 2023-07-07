import { AuthenticatedApp } from "./modules/router/components/AuthenticatedApp";
import { UnauthenticatedApp } from "./modules/router/components/UnauthenticatedApp";
import { useAuth } from "./modules/auth/authProvider";
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
