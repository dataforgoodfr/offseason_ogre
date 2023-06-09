import { Prisma } from "@prisma/client";
import { database } from "../../../database";
import { NO_TEAM } from "../../teams/constants/teams";
import { services as teamServices } from "../../teams/services";
import { Game } from "../types";
import { register } from "./register";

const model = database.game;
type Model = Game;

const crudServices = {
  queries: model,
  getDocument,
  getMany,
  create,
  update,
};
const services = { ...crudServices, register };

export { services };

async function getDocument(
  idOrWhere: number | Prisma.GameFindFirstArgs["where"]
): Promise<Model | null> {
  return model.findFirst({
    where: typeof idOrWhere === "number" ? { id: idOrWhere } : idOrWhere,
    include: {
      teams: {
        where: { isDeleted: false },
        include: {
          players: {
            include: {
              user: true,
              actions: {
                include: {
                  action: true,
                },
              },
              profile: {
                include: {
                  personalization: true,
                },
              },
            },
          },
          actions: {
            include: {
              action: {
                include: {
                  pointsIntervals: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getMany(partial: Partial<Model> = {}): Promise<Model[]> {
  return model.findMany({ where: partial, include: { teacher: true } });
}

async function create(document: Omit<Model, "id">): Promise<Model> {
  const game = await model.create({ data: document });
  await teamServices.create({ gameId: game.id, name: NO_TEAM });
  return game;
}

async function update(id: number, document: Partial<Omit<Model, "id">>) {
  return model.update({
    data: document,
    where: { id },
    include: {
      teams: true,
    },
  });
}
