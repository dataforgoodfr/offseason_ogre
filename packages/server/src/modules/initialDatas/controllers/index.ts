import { Request, Response } from "express";
import { PersonaDataConsumption } from "../dataConsumption";
import { energyConsumption } from "../types";

const controllers = {
  getManyDatas,
};

async function getManyDatas(request: Request, response: Response) {
  const PersonaDataConsumption2: energyConsumption[] = PersonaDataConsumption;
  response.status(200).json({ PersonaDataConsumption2 });
}

export { controllers };
