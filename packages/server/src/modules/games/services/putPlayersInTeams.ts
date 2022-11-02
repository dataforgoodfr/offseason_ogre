import { database } from "../../../database";

export { putPlayersInTeams };

async function putPlayersInTeams({ gameId }: { gameId: number }) {
  const teams = (
    await database.team.findMany({ where: { gameId, showInGame: true } })
  )
    .filter((team) => team.name !== "Aucune équipe")
    .map(({ id }) => id);
  const players = await database.players.findMany({ where: { gameId } });
  return players.map(async (player) =>
    database.players.update({
      where: { userId_gameId: { gameId, userId: player.userId } },
      data: { teamId: teams[Math.floor(Math.random() * teams.length)] },
    })
  );
}
