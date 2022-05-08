import type { User } from "./modules/users/types";

declare global {
  namespace Express {
    interface Response {
      user?: User;
    }
  }
}
