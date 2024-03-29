import { Players, Prisma } from "@prisma/client";
import { database } from "../../../database";

const model = database.players;

export const playerServices = {
  findOne,
  findMany,
  update,
  updateMany,
};

async function findOne<
  OptionsInclude extends Parameters<typeof model.findUnique>[0]["include"]
>(
  gameId: number,
  userId: number,
  options: {
    include?: OptionsInclude;
  } = {}
): Promise<Prisma.PlayersGetPayload<{
  include: OptionsInclude;
}> | null> {
  return model.findUnique({
    where: {
      userId_gameId: {
        gameId,
        userId,
      },
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
    include?: OptionsInclude;
  } = {}
): Promise<
  Prisma.PlayersGetPayload<{
    include: OptionsInclude;
  }>[]
> {
  return model.findMany({
    where: {
      gameId,
    },
    ...options,
  }) as any;
}

async function update(
  gameId: number,
  userId: number,
  data: Partial<Omit<Players, "id">>
) {
  return model.update({
    where: {
      userId_gameId: {
        gameId,
        userId,
      },
    },
    data,
  });
}

async function updateMany(
  gameId: number,
  data: Partial<Omit<Players, "id">>
): Promise<void> {
  await model.updateMany({
    where: {
      gameId,
    },
    data,
  });
}
