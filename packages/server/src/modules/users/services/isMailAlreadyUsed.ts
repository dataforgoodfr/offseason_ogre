import { database } from "../../../database";

export { isMailAlreadyUsed };

async function isMailAlreadyUsed(
  email: string,
  { excludeUser }: { excludeUser?: number } = {}
): Promise<boolean> {
  const userWithEmail = await database.user.findUnique({ where: { email } });
  if (userWithEmail === null || userWithEmail.id === excludeUser) {
    return false;
  }
  return true;
}
