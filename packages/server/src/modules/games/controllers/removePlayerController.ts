import { Request, Response } from "express";
import { z } from "zod";
import { services as playersServices } from "../../players/services";

export { removePlayerController };

async function removePlayerController(request: Request, response: Response) {
  const bodySchema = z.object({
    gameId: z.number(),
    userId: z.number(),
  });
  const { gameId, userId } = bodySchema.parse(request.body);
  await playersServices.remove({ gameId, userId });
  response.status(200).json({});
}
