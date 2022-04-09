import { prisma } from "../../../database";
import { CrudServices } from "../../utils/crudBuilders";
import { User } from "../types/entity";
import * as customServices from "./";

const model = prisma.user;
const crudServices = { getDocument } as CrudServices<User>;
const services = { ...crudServices, ...customServices };

export { services };

function getDocument(id: number): Promise<User> {
  return model.findUnique({ where: { id } });
}
