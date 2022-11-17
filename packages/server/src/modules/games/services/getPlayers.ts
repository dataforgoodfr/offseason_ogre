import { database } from "../../../database";

export { getPlayers };

function getPlayers({ gameId }: { gameId: number }) {
  return database.user.findMany({
    where: { playedGames: { some: { gameId } } },
    include: {
      playedGames: {
        where: { gameId },
        include: { team: true, profile: true },
      },
    },
  });
}
