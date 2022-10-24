import { AuthenticatedApp } from "./AuthenticatedApp";
import { useAuth } from "./modules/auth/authProvider";
import { UnauthenticatedApp } from "./UnauthenticatedApp";
import { hotjar } from "react-hotjar";
import { useEffect } from "react";

export default App;

function App() {
  useEffect(() => {
    hotjar.initialize(3215542, 6);
  }, []);

  const { user } = useAuth();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}
