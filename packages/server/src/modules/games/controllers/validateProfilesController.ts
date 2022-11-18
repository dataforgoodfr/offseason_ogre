import { Request, Response } from "express";
import { z } from "zod";
import { services as playersServices } from "../../players/services";

export { validateProfilesController };

async function validateProfilesController(
  request: Request,
  response: Response
) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { id } = paramsSchema.parse(request.params);
  await playersServices.validateProfiles(id);
  response.status(200).json({});
}
