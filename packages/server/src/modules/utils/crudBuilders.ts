import type { Request, Response } from "express";
import * as z from "zod";

export { buildCrudControllers, buildCrudServices };
export type { CrudControllers, CrudServices };

interface CrudServices<T> {
  createDocument: (document: Omit<T, "id">) => Promise<T>;
  getDocument: (id: number) => Promise<T>;
}

interface PrismaModel<T> {
  create: ({ data: document }: { data: Omit<T, "id"> }) => Promise<T>;
  findUnique: ({ where: { id } }: { where: { id: number } }) => Promise<T>;
}

function buildCrudServices<T>(model: PrismaModel<T>): CrudServices<T> {
  const getDocument = (id: number): Promise<T> =>
    model.findUnique({ where: { id } });

  const createDocument = (document: Omit<T, "id">): Promise<T> =>
    model.create({ data: document });

  return { createDocument, getDocument };
}

interface CrudControllers {
  getDocumentController: (request: Request, response: Response) => void;
}

function buildCrudControllers<T>(services: CrudServices<T>): CrudControllers {
  const getDocumentController = async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    });
    const { id } = paramsSchema.parse(req.params);
    const document = await services.getDocument(id);
    res.status(200).json({ data: document });
  };
  return { getDocumentController };
}
