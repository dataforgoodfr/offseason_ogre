import { Request, Response } from "express";
import { z } from "zod";
import * as services from "../services";

export { getAllActionsController, getActionsController };

async function getAllActionsController(request: Request, response: Response) {
  const actions = await services.getAll();
  response.status(200).json({ actions });
}

async function getActionsController(request: Request, response: Response) {
  const querySchema = z.object({
    step: z.string().regex(/^\d+$/).transform(Number),
  });
  const { step } = querySchema.parse(request.params);
  const actions = await services.getMany(step);
  response.status(200).json({ actions });
}
