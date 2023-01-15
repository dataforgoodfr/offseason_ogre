import { database } from "../../../database";
import { User, Players } from "../types/entity";
import { authenticateUser } from "./authenticateUser";
import { isMailAlreadyUsed } from "./isMailAlreadyUsed";
import { sendMagicLink } from "./sendMagicLink";
import { signUp } from "./signUp";

const model = database.user;
const userOnGameModel = database.players;

type Model = User;
type PlayersModel = Players;

const crudServices = {
  getDocument,
  getMany,
  create,
  update,
  getTeamForPlayer,
};
const services = {
  ...crudServices,
  isMailAlreadyUsed,
  sendMagicLink,
  signUp,
  authenticateUser,
};

export { services };

async function getDocument(id: number): Promise<Model | null> {
  return model.findUnique({ where: { id } });
}

async function getMany({
  where,
  orderBy = {},
  page = 1,
}: {
  where?: NonNullable<Parameters<typeof model.findMany>[0]>["where"];
  orderBy?: { [k: string]: "asc" | "desc" };
  page?: number;
}): Promise<Model[]> {
  // TODO: set page size to 100 after v1.
  const PAGE_SIZE = 100_000;
  const pageIdx = page - 1;
  return model.findMany({
    where,
    orderBy,
    skip: pageIdx * PAGE_SIZE,
    take: PAGE_SIZE,
  });
}

async function create(newUser: Omit<Model, "id">): Promise<Model> {
  if (await isMailAlreadyUsed(newUser.email)) {
    throw new Error("Email is already taken.");
  }
  return model.create({
    data: { ...newUser },
  });
}

async function update(
  id: number,
  document: Partial<Omit<Model, "id">>
): Promise<Model> {
  if (document.email) {
    if (await isMailAlreadyUsed(document.email, { excludeUser: id })) {
      throw new Error("Email is already taken.");
    }
  }

  return model.update({ data: document, where: { id } });
}

async function getTeamForPlayer(
  gameId: number,
  userId: number
): Promise<PlayersModel | null> {
  return userOnGameModel.findUnique({
    where: { userId_gameId: { gameId, userId } },
    include: { game: true, team: true },
  });
}
