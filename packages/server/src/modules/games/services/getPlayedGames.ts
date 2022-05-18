import { database } from "../../../database";

export { getPlayedGames };

function getPlayedGames({ userId }: { userId: number }) {
  return database.game.findMany({
    where: { players: { some: { userId } } },
  });
}
