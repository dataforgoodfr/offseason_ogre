import { database } from "../../../database";

export { register };

async function register({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  const team1 = await database.team.upsert({
    where: { gameId_name: { gameId, name: "Team 1" } },
    update: {},
    create: { gameId, name: "Team 1" },
  });
  const team2 = await database.team.upsert({
    where: { gameId_name: { gameId, name: "Team 2" } },
    update: {},
    create: { gameId, name: "Team 2" },
  });
  await database.usersOnGames.create({
    data: {
      gameId,
      userId,
      teamId: Math.random() > 0.5 ? team1.id : team2.id,
    },
  });
}
