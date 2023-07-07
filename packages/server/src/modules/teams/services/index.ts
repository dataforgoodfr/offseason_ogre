import { Prisma, Team } from "@prisma/client";
import { database } from "../../../database";
import { createBusinessError } from "../../utils/businessError";
import { NO_TEAM } from "../constants/teams";
import * as teamActionServices from "../../teamActions/services";

const model = database.team;
type Model = Team;

export { services };

const crudServices = {
  queries: model,
  create,
  getMany,
  get,
  update,
  createMany,
  remove,
  removeMany,
  resetTeamsName,
  buildTeamName,
};

const services = { ...crudServices };

async function create(
  document: Omit<Model, "id" | "scenarioName" | "isDeleted">
): Promise<Model> {
  return model.create({ data: document });
}

async function createMany(
  teams: NonNullable<Parameters<typeof model.create>[0]>["data"][]
) {
  return Promise.all(
    teams.map((team) =>
      model.create({
        data: team,
      })
    )
  );
}

async function getMany(
  partial: NonNullable<Parameters<typeof model.findMany>[0]>["where"] = {}
): Promise<Model[]> {
  return model.findMany({
    where: { ...partial, isDeleted: false },
    orderBy: {
      id: "asc",
    },
  });
}

async function get<
  OptionsInclude extends Parameters<typeof model.findUnique>[0]["include"]
>(
  id: number,
  options: {
    include?: OptionsInclude;
  } = {}
): Promise<Prisma.TeamGetPayload<{
  include: OptionsInclude;
}> | null> {
  return model.findUnique({ where: { id }, ...options }) as any;
}

async function update(
  teamId: number,
  document: Partial<Omit<Model, "id">>
): Promise<Model> {
  return model.update({
    where: { id: teamId },
    data: document,
  });
}

async function remove({ id: teamId }: { id: number }) {
  const teamToRemove = await get(teamId);

  if (!teamToRemove) {
    throw createBusinessError("TEAM_NOT_FOUND", {
      prop: "id",
      value: teamId,
    });
  }

  const targetTeam = await model.findFirst({
    where: { gameId: teamToRemove.gameId, name: NO_TEAM },
  });
  if (targetTeam) {
    await database.players.updateMany({
      where: { teamId },
      data: { teamId: targetTeam.id },
    });
  }

  await teamActionServices.remove({ teamId });

  return model.delete({
    where: { id: teamId },
  });
}

async function removeMany(teams: { id: number }[]) {
  return Promise.all(teams.map((team) => remove(team)));
}

async function resetTeamsName(gameId: number) {
  const teams = await model.findMany({
    where: { gameId, name: { not: NO_TEAM } },
    orderBy: { id: "asc" },
  });

  // Since the name of a team must be unique, all teams are first given
  // a temporary name to free the standard team names.
  await Promise.all(
    teams.map((team, idx) =>
      model.update({
        where: { id: team.id },
        data: { name: `Renaming ${buildTeamName(idx + 1)}` },
      })
    )
  );

  await Promise.all(
    teams.map((team, idx) =>
      model.update({
        where: { id: team.id },
        data: { name: buildTeamName(idx + 1) },
      })
    )
  );
}

function buildTeamName(nb: number) {
  return `Équipe ${nb}`;
}
