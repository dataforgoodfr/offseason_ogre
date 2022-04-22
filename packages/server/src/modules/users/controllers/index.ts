import { services } from "../services";
import { buildCrudControllers } from "../../utils/crudBuilders";

const crudController = buildCrudControllers(services);
const controllers = { ...crudController };

export { controllers };
