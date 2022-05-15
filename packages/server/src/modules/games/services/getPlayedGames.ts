import { prisma } from "../../../database";

export { getPlayedGames };

function getPlayedGames({ userId }: { userId: number }) {
  return prisma.game.findMany({
    where: { players: { some: { userId } } },
  });
}
