import { Request, Response } from "express";
import { z } from "zod";
import { removeTeam } from "../services/removeTeam";

export { removeTeamController };

async function removeTeamController(request: Request, response: Response) {
  const bodySchema = z.object({
    gameId: z.number(),
    teamId: z.number(),
  });
  const { gameId, teamId } = bodySchema.parse(request.body);
  await removeTeam({ gameId, teamId });
  response.status(200).json({});
}
