import { Request, Response } from "express";
import { z } from "zod";
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
    quantity: z.number(),
  });
  const { gameId, quantity } = bodySchema.parse(request.body);
  await services.createMany(gameId, quantity);
  response.status(200).json({});
}
