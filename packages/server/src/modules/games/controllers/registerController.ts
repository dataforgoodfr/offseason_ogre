import { Request, Response } from "express";
import { z } from "zod";
import { register } from "../services/register";

export { registerController };

async function registerController(request: Request, response: Response) {
  const bodySchema = z.object({
    gameCode: z.string(),
  });
  const user = response.locals.user || null;
  if (user === null) {
    throw new Error("User must be logged in.");
  }
  const { gameCode } = bodySchema.parse(request.body);
  const gameId = await register({ gameCode, userId: user.id });
  response.status(200).json({
    gameId,
  });
}
