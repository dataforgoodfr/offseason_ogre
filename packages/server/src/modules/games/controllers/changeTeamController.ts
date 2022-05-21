import { Request, Response } from "express";
import { z } from "zod";
import { changeTeam } from "../services/changeTeam";

export { changeTeamController };

async function changeTeamController(request: Request, response: Response) {
  const bodySchema = z.object({
    gameId: z.number(),
    teamId: z.number(),
    userId: z.number(),
  });
  const { gameId, teamId, userId } = bodySchema.parse(request.body);
  await changeTeam({ gameId, teamId, userId });
  response.status(200).json({});
}
