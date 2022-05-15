import { prisma } from "../../../database";

export { register };

async function register({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  await prisma.game.update({
    where: { id: gameId },
    data: { players: { connect: [{ id: userId }] } },
  });
}
