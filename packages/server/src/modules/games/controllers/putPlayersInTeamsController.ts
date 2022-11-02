import { Request, Response } from "express";
import { z } from "zod";
import { putPlayersInTeams } from "../services/putPlayersInTeams";

export { putPlayersInTeamsController };

async function putPlayersInTeamsController(
  request: Request,
  response: Response
) {
  const bodySchema = z.object({
    gameId: z.number(),
  });
  const { gameId } = bodySchema.parse(request.body);
  await putPlayersInTeams({ gameId });
  response.status(200).json({});
}
