import { RoleName, User } from "../users/types";

export { hasRole };

const hasRole = (roles: RoleName[], user: User | null | undefined) =>
  roles.includes(user?.role?.name || ("" as RoleName));
