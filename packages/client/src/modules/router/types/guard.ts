import { UserPermissions } from "../../auth/authProvider";

export type { Guard };

type Guard = (permissions: UserPermissions) => boolean;
