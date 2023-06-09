import { Team } from "@prisma/client";
import { services } from "../../teams/services";

export const teamServices = {
  queries: services.queries,
  update,
};

async function update(teamId: number, data: Partial<Omit<Team, "id">>) {
  return services.queries.update({
    where: {
      id: teamId,
    },
    data,
  });
}
