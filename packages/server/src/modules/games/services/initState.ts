import { database } from "../../../database";

export { initState };

async function initState({ gameId }: { gameId: number }) {
  const gameWithTeams = await database.game.findUnique({
    where: { id: gameId },
    include: {
      teams: {
        include: {
          players: {
            include: {
              user: true,
              actions: {
                include: { action: true },
              },
            },
          },
        },
      },
    },
  });
  return { gameWithTeams };
}
