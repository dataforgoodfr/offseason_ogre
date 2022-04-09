import type { Request, Response } from "express";
import * as z from "zod";

export { buildCrudControllers };
export type { CrudControllers, CrudServices };

interface CrudServices<T> {
  getDocument: (id: number) => Promise<T>;
}

interface CrudControllers<T> {
  getDocumentController: (request: Request, response: Response) => void;
}

function buildCrudControllers<T>(
  services: CrudServices<T>
): CrudControllers<T> {
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
