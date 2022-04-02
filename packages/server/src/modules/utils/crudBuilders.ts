import type { Model } from "sequelize";
import type { Request, Response } from "express";
import * as z from "zod";

export { buildCrudControllers, buildCrudServices };
export type { CrudControllers, CrudServices };

interface CrudServices<T> {
  getDocument: (id: number) => Promise<T>;
}

interface CrudControllers<T> {
  getDocumentController: (request: Request, response: Response) => void;
}

// Typing is badly done, but I don't want to spend more type unstanding sequelize typing
// https://stackoverflow.com/questions/55166230/sequelize-typescript-typeof-model
type Constructor<M> = new (...args: any[]) => M;
type ModelType<M extends Model<M>> = Constructor<M> & typeof Model;

function buildCrudServices<T, M extends Model<M>>(
  model: ModelType<M>
): CrudServices<T> {
  const getDocument = async (id: number): Promise<T> => {
    const document = model.findByPk(id) as unknown as T | null;
    if (document === null) {
      throw new Error("Not found!");
    }
    return document;
  };

  return {
    getDocument,
  };
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
