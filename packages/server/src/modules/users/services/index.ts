import { prisma } from "../../../database";
import { buildCrudServices } from "../../utils/crudBuilders";
import { User } from "../types/entity";

const model = prisma.user;
const crudServices = buildCrudServices<User>(model);
const services = { ...crudServices };

export { services };
