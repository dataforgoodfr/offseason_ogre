import { database } from "../../../database";

export { removeTeam };

async function removeTeam({
  gameId,
  teamId,
}: {
  gameId: number;
  teamId: number;
}) {
  const noTeamId = (
    await database.team.findFirst({ where: { gameId, name: "Aucune équipe" } })
  )?.id;
  await database.players.updateMany({
    where: { teamId },
    data: { teamId: noTeamId },
  });

  await database.team.update({
    where: { id: teamId },
    data: { showInGame: false },
  });
}
