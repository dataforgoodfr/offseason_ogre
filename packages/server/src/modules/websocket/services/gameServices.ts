import { services } from "../../games/services";

export const gameServices = {
  queries: services.queries,
  findOne,
};

async function findOne(gameId: number) {
  return services.queries.findUnique({
    where: { id: gameId },
  });
}
