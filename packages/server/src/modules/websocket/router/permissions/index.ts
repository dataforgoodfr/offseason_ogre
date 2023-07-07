import { Role, User } from "@prisma/client";

export { buildPermissions };

function buildPermissions(user: User, role: Role) {
  return {
    canUpdateGame: ["admin", "teacher"].includes(role.name),
  };
}
