import { database } from "../../../database";
import { NO_TEAM } from "../../teams/constants/teams";

export { removeTeam };

async function removeTeam({
  gameId,
  teamId,
}: {
  gameId: number;
  teamId: number;
}) {
  const noTeamId = (
    await database.team.findFirst({ where: { gameId, name: NO_TEAM } })
  )?.id;
  await database.players.updateMany({
    where: { teamId },
    data: { teamId: noTeamId },
  });

  await database.team.update({
    where: { id: teamId },
    data: { isDeleted: true },
  });
}
