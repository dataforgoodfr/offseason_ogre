import { database } from "../../../database";
import { NO_TEAM } from "../../teams/constants/teams";

export { putPlayersInTeams };

async function putPlayersInTeams({ gameId }: { gameId: number }) {
  const teams = (
    await database.team.findMany({ where: { gameId, isDeleted: false } })
  )
    .filter((team) => team.name !== NO_TEAM)
    .map(({ id }) => id);
  const players = await database.players.findMany({ where: { gameId } });
  return Promise.all(
    players.map((player) =>
      database.players.update({
        where: { userId_gameId: { gameId, userId: player.userId } },
        data: { teamId: teams[Math.floor(Math.random() * teams.length)] },
      })
    )
  );
}
