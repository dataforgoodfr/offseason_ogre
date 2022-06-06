import { database } from "../../../database";

export { register };

async function register({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  const team1 = await database.team.findUnique({
    where: { gameId_name: { gameId, name: "Equipe 1" } },
    rejectOnNotFound: true,
  });
  const team2 = await database.team.findUnique({
    where: { gameId_name: { gameId, name: "Equipe 2" } },
    rejectOnNotFound: true,
  });
  await database.players.create({
    data: {
      gameId,
      userId,
      teamId: Math.random() > 0.5 ? team1.id : team2.id,
    },
  });
}
