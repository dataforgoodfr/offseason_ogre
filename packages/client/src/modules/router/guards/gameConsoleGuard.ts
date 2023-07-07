import { Guard } from "../types/guard";

export { gameConsoleGuard };

const gameConsoleGuard: Guard = (permissions) =>
  permissions.canAccessGameConsole;
