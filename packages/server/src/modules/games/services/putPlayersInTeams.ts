import { Players } from "@prisma/client";
import { flatten } from "lodash";
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

  const teamPlayerAssignment = getTeamPlayerAssignment(players, teamIds);

  return Promise.all(
    teamPlayerAssignment.map((assignment) =>
      database.players.update({
        where: { userId_gameId: { gameId, userId: assignment.player.userId } },
        data: { teamId: assignment.teamId },
      })
    )
  );
}

function getTeamPlayerAssignment(players: Players[], teamIds: number[]) {
  const playerCount = players.length;
  const teamCount = teamIds.length;

  const basePlayerCountPerTeam = Math.floor(playerCount / teamCount);
  const remainingPlayerCount = playerCount % teamCount;
  const playerIdxToTeamId = flatten(
    Array(teamCount)
      .fill(basePlayerCountPerTeam)
      .map(dispatchRemainingPlayerCount(remainingPlayerCount))
      .map(createArraysOfTeamIds(teamIds))
  );

  const teamPlayerAssignment = players.map((player, idx) => ({
    player,
    teamId: playerIdxToTeamId[idx],
  }));

  return teamPlayerAssignment;
}

function dispatchRemainingPlayerCount(remainingPlayerCount: number) {
  return (count: number, idx: number) =>
    idx < remainingPlayerCount ? count + 1 : count;
}

function createArraysOfTeamIds(teamIds: number[]) {
  return (count: number, idx: number) => Array(count).fill(teamIds[idx]);
}
