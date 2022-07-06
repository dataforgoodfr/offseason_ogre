import { Request, Response } from "express";
import * as services from "../services";

export { getActionsController };

async function getActionsController(request: Request, response: Response) {
  const actions = await services.getMany();
  response.status(200).json({ actions });
}
