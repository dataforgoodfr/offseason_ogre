import { Request, Response } from "express";
import { range } from "lodash";
import { z } from "zod";
import { getAddOrRemoveCount } from "../../../lib/array";
import { services } from "../services";

export { getTeamsController, getTeamController, createTeamsController };

async function getTeamsController(request: Request, response: Response) {
  const querySchema = z.object({
    gameId: z.string().regex(/^\d+$/).transform(Number).optional(),
  });
  const query = querySchema.parse(request.query);
  const teams = await services.getMany(query);
  response.status(200).json({ teams });
}

async function getTeamController(request: Request, response: Response) {
  const querySchema = z.object({
    teamId: z.string().regex(/^\d+$/).transform(Number),
  });
  const { teamId } = querySchema.parse(request.params);
  const teams = await services.get(teamId);
  response.status(200).json({ teams });
}

async function createTeamsController(request: Request, response: Response) {
  const bodySchema = z.object({
    gameId: z.number(),
    quantity: z.number().gte(1),
  });
  const { gameId, quantity } = bodySchema.parse(request.body);

  const existingTeams = await services.getPlayableTeams({ gameId });
  const { addCount, removeCount } = getAddOrRemoveCount(
    existingTeams,
    quantity
  );

  if (addCount > 0) {
    const teamsToCreate = range(addCount).map((i) => ({
      gameId,
      name: `Creating ${services.buildTeamName(existingTeams.length + i + 1)}`,
    }));
    await services.createMany(teamsToCreate);
    await services.resetTeamsName(gameId);
  }
  if (removeCount > 0) {
    const teamsToRemove = existingTeams.slice(-removeCount);
    await services.removeMany(teamsToRemove);
    await services.resetTeamsName(gameId);
  }

  response.status(200).json({});
}
