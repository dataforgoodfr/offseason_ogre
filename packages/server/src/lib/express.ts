import { Role, User } from "@prisma/client";
import type { Response } from "express";

export { getUserRequesting };

function getUserRequesting(response: Response): (User & { role: Role }) | null {
  return response.locals.user || null;
}
