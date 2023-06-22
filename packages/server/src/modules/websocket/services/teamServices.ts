import { Prisma, Team } from "@prisma/client";
import { database } from "../../../database";
import { ObjectBuilder } from "../../../lib/object";
import { NO_TEAM } from "../../teams/constants/teams";

const model = database.team;

export const teamServices = {
  findOne,
  findMany,
  update,
};

async function findOne<
  OptionsInclude extends Parameters<typeof model.findUnique>[0]["include"]
>(
  id: number,
  options: {
    include?: OptionsInclude;
  } = {}
): Promise<Prisma.TeamGetPayload<{
  include: OptionsInclude;
}> | null> {
  return model.findUnique({
    where: {
      id,
    },
    ...options,
  }) as any;
}

async function findMany<
  OptionsInclude extends NonNullable<
    Parameters<typeof model.findMany>[0]
  >["include"]
>(
  gameId: number,
  options: {
    includeNoTeam?: boolean;
    include?: OptionsInclude;
  } = {}
): Promise<
  Prisma.TeamGetPayload<{
    include: OptionsInclude;
  }>[]
> {
  const { includeNoTeam, ...optionsRest } = options;

  const whereBuilder = new ObjectBuilder().add("gameId", gameId);
  if (!includeNoTeam) {
    whereBuilder.add({ name: { not: { equals: NO_TEAM } } });
  }

  return model.findMany({
    where: whereBuilder.get(),
    orderBy: {
      id: "asc",
    },
    ...optionsRest,
  }) as any;
}

async function update(teamId: number, data: Partial<Omit<Team, "id">>) {
  return model.update({
    where: {
      id: teamId,
    },
    data,
  });
}
