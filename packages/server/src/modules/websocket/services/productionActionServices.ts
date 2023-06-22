import { database } from "../../../database";

const model = database.productionAction;

export const productionActionServices = {
  findAll,
};

async function findAll() {
  return model.findMany({
    orderBy: {
      id: "asc",
    },
  });
}
