import { Request, Response } from "express";
import { z } from "zod";
import { services } from "../../teams/services";

export { removeTeamController };

async function removeTeamController(request: Request, response: Response) {
  const bodySchema = z.object({
    teamId: z.number(),
  });
  const { teamId } = bodySchema.parse(request.body);
  const removedTeam = await services.remove({ id: teamId });
  await services.resetTeamsName(removedTeam.gameId);
  response.status(200).json({});
}
