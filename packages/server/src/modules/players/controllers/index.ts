import * as customControllers from './';
import { services } from '../services'
import { buildCrudControllers } from '../../utils/crudBuilders';

const crudController = buildCrudControllers(services);
const controllers = { ...crudController, ...customControllers };

export { controllers };
