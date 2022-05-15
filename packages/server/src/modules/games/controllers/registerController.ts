import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../database";

export { registerController };

async function registerController(request: Request, response: Response) {
  const bodySchema = z.object({
    gameId: z.number(),
  });
  const user = response.locals.user || null;
  if (user === null) {
    throw new Error("User must be logged in.");
  }
  const { gameId } = bodySchema.parse(request.body);
  await prisma.game.update({
    where: { id: gameId },
    data: { players: { connect: [{ id: user.id }] } },
  });
  response.status(200).json({});
}
