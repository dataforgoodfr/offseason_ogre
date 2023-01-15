import { Role } from "@prisma/client";
import type { Request, Response } from "express";
import { pick } from "lodash";
import { z } from "zod";
import { getUserRequesting } from "../../../lib/express";
import { rolesServices } from "../../roles/services";
import { services } from "../services";
import { logoutController } from "./logoutController";
import { signInController } from "./signInController";

const crudController = {
  getDocumentController,
  signUpController,
  getTeamForPlayer,
};
const controllers = {
  ...crudController,
  getManyControllers,
  getLoggedUserController,
  logoutController,
  sendMagicLinkController,
  signInController,
  updateUser,
};

export { controllers };

async function getManyControllers(request: Request, response: Response) {
  const querySchema = z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    sort: z
      .string()
      .regex(/[a-zA-Z_]+:(asc|desc)+/)
      .default("id:asc"),
  });
  const { page, sort } = querySchema.parse(request.query);
  const [sortAttr, sortValue] = sort.split(":") as [string, "asc" | "desc"];
  const documents = await services.getMany({
    orderBy: { [sortAttr]: sortValue },
    page,
  });
  response.status(200).json({ documents });
}

async function signUpController(request: Request, response: Response) {
  const bodySchema = z.object({
    country: z.string(),
    email: z.string(),
    lastName: z.string(),
    firstName: z.string(),
  });
  const documentToCreate = bodySchema.parse(request.body);

  const playerRole = await rolesServices.getOne({ name: "player" });

  const newDocument = await services.signUp({
    ...documentToCreate,
    isTeacher: false,
    roleId: playerRole.id,
  });
  response.status(201).json({ data: newDocument });
}

async function getDocumentController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { id } = paramsSchema.parse(request.params);
  const document = await services.getDocument(id);
  response.status(200).json({ data: document });
}

async function getLoggedUserController(request: Request, response: Response) {
  const user = response.locals.user || null;
  response.status(200).json({ user });
}

async function sendMagicLinkController(request: Request, response: Response) {
  const { email } = request.body;
  await services.sendMagicLink(email);
  response
    .status(200)
    .send({ hasEmailBeenSent: true, hasUserWithThatEmail: true });
}

async function getTeamForPlayer(request: Request, response: Response) {
  const paramsSchema = z.object({
    gameId: z.string().regex(/^\d+$/).transform(Number),
    id: z.string().regex(/^\d+$/).transform(Number),
  });
  const { gameId, id } = paramsSchema.parse(request.params);
  const document = await services.getTeamForPlayer(gameId, id);
  response.status(200).json({ data: document });
}

const bodySchemaUpdate = z.object({
  country: z.string().optional(),
  email: z.string().optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  isTeacher: z.boolean().optional(),
  roleId: z.number().optional(),
});
async function updateUser(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  });

  const { id } = paramsSchema.parse(request.params);

  const updateData = filterUpdateData(
    bodySchemaUpdate.parse(request.body),
    getUserRequesting(response)?.role
  );

  const document = await services.update(id, updateData);
  response.status(200).json({ document });
}

function filterUpdateData(
  update: ReturnType<typeof bodySchemaUpdate.parse>,
  role: Role | null | undefined
) {
  if (role?.name === "admin") {
    return update;
  }

  return pick(update, "country", "email", "lastName", "firstName");
}
