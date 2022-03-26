import { CrudControllers, CrudServices } from '../../types/layers';
import * as customControllers from './';
import { services } from '../services'

const crudController = buildCrudControllers(services);
const controllers = { ...crudController, ...customControllers };

export { controllers };

function buildCrudControllers<T>(services: CrudServices<T>): CrudControllers<T> {
    const getDocumentController = async(req, res) => {
        const id = +req.params.id;
        const document = await services.getDocument(id)
        res.status(200).json({ data: document });
    };
    return { getDocumentController };
}