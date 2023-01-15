import { Request, Response } from "express";
import { rolesServices } from "../services";

export const rolesController = {
  getRoles,
};

async function getRoles(_: Request, response: Response) {
  const roles = await rolesServices.getMany();
  response.status(200).json({ roles });
}
