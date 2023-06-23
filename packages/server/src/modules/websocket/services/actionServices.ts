import { database } from "../../../database";

const model = database.action;

export const actionServices = {
  findAll,
};

async function findAll() {
  return model.findMany({
    orderBy: {
      id: "asc",
    },
  });
}
