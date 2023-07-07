import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../auth/authProvider";
import { Guard } from "../../types/guard";

export { RouteGuard };

function RouteGuard({ guard }: { guard: Guard }) {
  const { permissions } = useAuth();

  if (!guard(permissions)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
