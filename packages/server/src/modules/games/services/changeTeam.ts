import { database } from "../../../database";

export { changeTeam };

async function changeTeam({
  gameId,
  teamId,
  userId,
}: {
  gameId: number;
  teamId: number;
  userId: number;
}) {
  await database.usersOnGames.update({
    where: { userId_gameId: { gameId, userId } },
    data: {
      gameId,
      userId,
      teamId,
    },
  });
}
