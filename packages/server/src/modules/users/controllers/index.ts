import type { Request, Response } from "express";
import { z } from "zod";
import { services } from "../services";

const crudController = { getDocumentController, createController };
const controllers = { ...crudController };

export { controllers };

async function createController(request: Request, response: Response) {
  const bodySchema = z.object({
    email: z.string().email(),
  });
  const documentToCreate = bodySchema.parse(request.body);
  const newDocument = await services.create(documentToCreate);
  response.status(201).json({ data: newDocument });
}

async function getDocumentController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { id } = paramsSchema.parse(request.params);
  const document = await services.getDocument(id);
  response.status(200).json({ data: document });
}
