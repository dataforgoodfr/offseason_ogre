import { Request, Response } from "express";
import { z } from "zod";
import { register } from "../services/register";

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
  await register({ gameId, userId: user.id });
  response.status(200).json({});
}
