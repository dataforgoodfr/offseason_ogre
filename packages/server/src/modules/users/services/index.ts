import { prisma } from "../../../database";
import { CrudServices } from "../../utils/crudBuilders";
import { User } from "../types/entity";

const model = prisma.user;
const crudServices = { getDocument } as CrudServices<User>;
const services = { ...crudServices };

export { services };

function getDocument(id: number): Promise<User> {
  return model.findUnique({ where: { id } });
}
