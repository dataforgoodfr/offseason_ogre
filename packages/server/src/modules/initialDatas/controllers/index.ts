import { PersonaDataConsumption } from "../dataConsumption"
import { Request, response, Response } from "express";
import { energyConsumption } from "../types";

console.log(PersonaDataConsumption);

const result = PersonaDataConsumption.filter(
	PersonaDataConsumption => PersonaDataConsumption.name === "consumptionCleanCook"
);

console.log(result);

const controllers = {
	getManyDatas
};

async function getManyDatas(request: Request, response: Response) {
	const PersonaDataConsumption2: energyConsumption[] = PersonaDataConsumption;
	response.status(200).json({ PersonaDataConsumption2 });
}

export { controllers };
