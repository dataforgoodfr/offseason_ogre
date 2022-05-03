import { useAuth } from "./modules/auth/authProvider";

export { AuthenticatedApp };

function AuthenticatedApp() {
  const { user } = useAuth();
  return <div>Congratz you are logged in as {user?.email}!</div>;
}
