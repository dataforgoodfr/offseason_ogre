import { Request, Response } from "express";
import { z } from "zod";
import { update } from "../services/personalization";

export { updateProfilesController };

async function updateProfilesController(request: Request, response: Response) {
  const schema = z.array(
    z.object({
      id: z.number(),
      origin: z.string(),
      personalizationName: z.string(),
      numberAdults: z.number().optional(),
      numberKids: z.number().optional(),
      car: z.boolean().optional(),
      carEnergy: z.string().optional(),
      carConsumption: z.number().optional(),
      carDistanceAlone: z.number().optional(),
      carDistanceHoushold: z.number().optional(),
      carAge: z.string().optional(),
      carDistanceCarsharing: z.number().optional(),
      planeDistance: z.number().optional(),
      trainDistance: z.number().optional(),
      houseType: z.string().optional(),
      houseSurface: z.number().optional(),
      heatingEnergy: z.string().optional(),
      heatingConsumption: z.number().optional(),
      heatingInvoice: z.number().optional(),
      heatPump: z.boolean().optional(),
      heatingTemperature: z.boolean().optional(),
      airConditionning: z.boolean().optional(),
      aCRoomNb: z.number().optional(),
      aCDaysNb: z.number().optional(),
      showerBath: z.string().optional(),
      showerNumber: z.number().optional(),
      showerTime: z.string().optional(),
      cookingKettle: z.boolean().optional(),
      cookingPlateTime: z.number().optional(),
      cookingOvenTime: z.number().optional(),
      cleaningWashingTime: z.number().optional(),
      cleaningDryerTime: z.number().optional(),
      cleaningDishwasherTime: z.number().optional(),
      refrigeratorNumber: z.number().optional(),
      freezerNumber: z.number().optional(),
      lightingSystem: z.string().optional(),
      eatingVegan: z.boolean().optional(),
      eatingVegetables: z.boolean().optional(),
      eatingDairies: z.boolean().optional(),
      eatingEggs: z.boolean().optional(),
      eatingMeat: z.boolean().optional(),
      eatingTinDrink: z.number().optional(),
      eatingZeroWaste: z.boolean().optional(),
      eatingLocal: z.boolean().optional(),
      eatingCatNumber: z.number().optional(),
      eatingDogNumber: z.number().optional(),
      eatingHorse: z.boolean().optional(),
      numericEquipment: z.boolean().optional(),
      numericWebTimeDay: z.boolean().optional(),
      numericVideoTimeDay: z.boolean().optional(),
      clothingQuantity: z.boolean().optional(),
    })
  );

  const rowsToUpdate = schema.parse(request.body);

  rowsToUpdate.forEach((personalization: any) =>
    update(personalization.id, personalization)
  );
  response.status(200).json({});
}
