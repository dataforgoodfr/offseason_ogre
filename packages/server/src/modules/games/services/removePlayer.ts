import { database } from "../../../database";

export { removePlayer };

async function removePlayer({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  await database.usersOnGames.delete({
    where: { userId_gameId: { gameId, userId } },
  });
}
