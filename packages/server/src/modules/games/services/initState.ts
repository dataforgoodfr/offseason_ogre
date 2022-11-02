import { database } from "../../../database";

export { initState };

async function initState({ gameId }: { gameId: number }) {
  const gameWithTeams = await database.game.findUnique({
    where: { id: gameId },
    include: {
      teams: {
        where: { isDeleted: false },
        include: {
          players: {
            include: {
              user: true,
              actions: {
                include: {
                  action: true,
                },
              },
            },
          },
          actions: {
            include: {
              action: {
                include: {
                  pointsIntervals: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return { gameWithTeams };
}
