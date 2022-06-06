import { database } from "../../../database";

export { removePlayer };

async function removePlayer({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  await database.players.delete({
    where: { userId_gameId: { gameId, userId } },
  });
}
