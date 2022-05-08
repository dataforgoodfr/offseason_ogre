import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";

const crudController = {
  createController,
};
const controllers = {
  ...crudController,
};

export { controllers };

async function createController(request: Request, response: Response) {
  const bodySchema = z.object({
    name: z.string(),
  });
  const documentToCreate = bodySchema.parse(request.body);
  const newDocument = await services.create({
    ...documentToCreate,
    date: new Date(),
    teacherId: response.locals.user.id,
  });
  response.status(201).json({ data: newDocument });
}
