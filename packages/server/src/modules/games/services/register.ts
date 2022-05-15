import { prisma } from "../../../database";

export { register };

async function register({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  await prisma.usersOnGames.create({
    data: { gameId, userId },
  });
}
