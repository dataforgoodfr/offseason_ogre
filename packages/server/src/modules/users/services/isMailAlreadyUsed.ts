import { database } from "../../../database";

export { isMailAlreadyUsed };

async function isMailAlreadyUsed(email: string): Promise<boolean> {
  const userWithEmail = await database.user.findUnique({ where: { email } });
  if (userWithEmail === null) {
    return false;
  }
  return true;
}
