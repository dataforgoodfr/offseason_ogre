import { Role, User } from "@prisma/client";
import type { Request, Response } from "express";
import { getUserRequesting } from "../../../lib/express";
import { services } from "../services";

export { getManyGamesControllers };

async function getManyGamesControllers(_: Request, response: Response) {
  const user = getUserRequesting(response);

  const documents = await getGames(user);

  response.status(200).json({ documents });
}

async function getGames(user: (User & { role: Role }) | null | undefined) {
  if (!user?.role) {
    return [];
  }

  if (user.role.name === "admin") {
    return services.getMany();
  }

  return services.getMany({
    teacherId: user.id,
  });
}
