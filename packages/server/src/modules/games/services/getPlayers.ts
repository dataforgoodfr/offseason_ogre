import { prisma } from "../../../database";

export { getPlayers };

function getPlayers({ gameId }: { gameId: number }) {
  return prisma.user.findMany({
    where: { playedGames: { some: { gameId } } },
    include: { playedGames: { where: { gameId }, include: { team: true } } },
  });
}
