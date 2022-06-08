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
  await database.players.update({
    where: { userId_gameId: { gameId, userId } },
    data: {
      gameId,
      userId,
      teamId,
    },
  });
}
