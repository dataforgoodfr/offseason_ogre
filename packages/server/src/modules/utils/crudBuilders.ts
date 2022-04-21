import type { Request, Response } from "express";
import * as z from "zod";

export { buildCrudControllers };
export type { CrudControllers, CrudServices };

interface CrudServices<T> {
	getDocument: (id: number) => Promise<T>;
	getAllDocuments: () => Promise<T>;
	getUser: (email: string) => Promise<T>;
}

interface CrudControllers<T> {
	getDocumentController: (request: Request, response: Response) => void;
	getAllDocumentsController: (request: Request, response: Response) => void;
	getUser: (request: Request, response: Response) => void;
}

function buildCrudControllers<T>(
	services: CrudServices<T>,
): CrudControllers<T> {
	const getDocumentController = async (req, res) => {
		const paramsSchema = z.object({
			id: z.string().regex(/^\d+$/).transform(Number),
		});
		const { id } = paramsSchema.parse(req.params);
		const document = await services.getDocument(id);
		res.status(200).json({ data: document });
	};
	const getAllDocumentsController = async (req, res) => {
		// const documents = await services.getAllDocuments();
		res.status(200).json("list of Users");
	};
	const getUser = async (req, res) => {
		const mailAddress = await services.getUser(req.body.data.email);
		if (mailAddress == null) {
			res.status(200).json("email address not registered");
		}
		else {
			res.status(200).json("the address " + req.body.data.email + " is registered");
		}
	};

	return { getDocumentController, getAllDocumentsController, getUser };
}

