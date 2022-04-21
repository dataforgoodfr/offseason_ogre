import { prisma } from "../../../database";
import { CrudServices } from "../../utils/crudBuilders";
import { User } from "../types/entity";
import * as customServices from "./";

const model = prisma.user;
const crudServices = { getDocument, getUser } as CrudServices<User>;
const services = { ...crudServices, ...customServices };

export { services };

function getDocument(id: number): Promise<User> {
	return model.findUnique({ where: { id } });
}

function getUser(email: string): Promise<User> {
	return model.findUnique({ where: { email } });
}

/* le type étant différent (Promise<User> vs Promise<User[]>) 
on ne peut mettre les deux fonctions dans le meme service.*/
/* function getAllDocuments(): Promise<User[]> {
	return model.findMany();
} */
