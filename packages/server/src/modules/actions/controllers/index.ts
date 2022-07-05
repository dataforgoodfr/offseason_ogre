import { Request, Response } from "express";
import { z } from "zod";
import * as services from "../services";

export { getActionsController };

async function getActionsController(request: Request, response: Response) {
//   const querySchema = z.object({
//     gameId: z.string().regex(/^\d+$/).transform(Number).optional(),
//   });
//   const query = querySchema.parse(request.query);
    const query = request.query;
    const actions = await services.getMany(query);
    response.status(200).json({ actions });
}
