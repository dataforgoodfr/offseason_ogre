import { Request, Response } from "express";
import { z } from "zod";
import { removePlayer } from "../services/removePlayer";

export { removePlayerController };

async function removePlayerController(request: Request, response: Response) {
  const bodySchema = z.object({
    gameId: z.number(),
    userId: z.number(),
  });
  const { gameId, userId } = bodySchema.parse(request.body);
  await removePlayer({ gameId, userId });
  response.status(200).json({});
}
