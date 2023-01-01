import { database } from "../../../database";
import { NO_TEAM } from "../../teams/constants/teams";

export { putPlayersInTeams };

async function putPlayersInTeams({ gameId }: { gameId: number }) {
  const teamIds = await database.team
    .findMany({ where: { gameId, isDeleted: false } })
    .then((teams) =>
      teams.filter((team) => team.name !== NO_TEAM).map(({ id }) => id)
    );

  if (!teamIds.length) {
    return [];
  }

  const players = await database.players.findMany({ where: { gameId } });

  const teamPlayerAssignment = players.map((player, idx) => ({
    player,
    teamId: teamIds[idx % teamIds.length],
  }));

  return Promise.all(
    teamPlayerAssignment.map((assignment) =>
      database.players.update({
        where: { userId_gameId: { gameId, userId: assignment.player.userId } },
        data: { teamId: assignment.teamId },
      })
    )
  );
}
