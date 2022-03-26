import type { Request, Response } from 'express';
export { CrudControllers, CrudServices };

interface CrudServices<T> {
    getDocument: (id: number) => Promise<T> 
}

interface CrudControllers<T> {
    getDocumentController: (request: Request, response: Response) => void
}