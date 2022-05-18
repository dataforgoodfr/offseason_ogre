import { Request, Response } from "express";
import { z } from "zod";
import * as services from "../services";

export { getTeamsController };

async function getTeamsController(request: Request, response: Response) {
  const querySchema = z.object({
    gameId: z.string().regex(/^\d+$/).transform(Number).optional(),
  });
  const query = querySchema.parse(request.query);
  const teams = await services.getMany(query);
  response.status(200).json({ teams });
}
