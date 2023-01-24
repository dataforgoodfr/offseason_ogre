import { Role, User } from "@prisma/client";
import type { Request, Response } from "express";
import { z } from "zod";
import { getUserRequesting } from "../../../lib/express";
import { services } from "../services";

export { getManyUsersController };

async function getManyUsersController(request: Request, response: Response) {
  const querySchema = z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    sort: z
      .string()
      .regex(/[a-zA-Z_]+:(asc|desc)+/)
      .default("id:asc"),
  });
  const { page, sort } = querySchema.parse(request.query);

  const [sortAttr, sortValue] = sort.split(":") as [string, "asc" | "desc"];
  const orderBy = { [sortAttr]: sortValue };

  const documents = await getUsers(
    { page, orderBy },
    getUserRequesting(response)
  );

  response.status(200).json({ documents });
}

async function getUsers(
  {
    page,
    orderBy,
  }: {
    page: number;
    orderBy: Record<string, any>;
  },
  user: (User & { role: Role }) | null | undefined
) {
  if (!user?.role) {
    return [];
  }

  if (user.role.name === "admin") {
    return services.getMany({ page, orderBy });
  }

  return services.getMany({
    page,
    orderBy,
    where: {
      playedGames: {
        some: {
          game: {
            teacherId: user.id,
          },
        },
      },
    },
  });
}
