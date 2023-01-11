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
      numberAdults: z.number().optional().nullable(),
      numberKids: z.number().optional().nullable(),
      car: z.boolean().optional().nullable(),
      carEnergy: z.string().optional().nullable(),
      carConsumption: z.number().optional().nullable(),
      carDistanceAlone: z.number().optional().nullable(),
      carDistanceHoushold: z.number().optional().nullable(),
      carAge: z.string().optional().nullable(),
      carDistanceCarsharing: z.number().optional().nullable(),
      planeDistance: z.number().optional().nullable(),
      trainDistance: z.number().optional().nullable(),
      houseType: z.string().optional().nullable(),
      houseSurface: z.number().optional().nullable(),
      heatingEnergy: z.string().optional().nullable(),
      heatingConsumption: z.number().optional().nullable(),
      heatingInvoice: z.number().optional().nullable(),
      heatPump: z.boolean().optional().nullable(),
      heatingTemperature: z.boolean().optional().nullable(),
      airConditionning: z.boolean().optional().nullable(),
      aCRoomNb: z.number().optional().nullable(),
      aCDaysNb: z.number().optional().nullable(),
      showerBath: z.string().optional().nullable(),
      showerNumber: z.number().optional().nullable(),
      showerTime: z.string().optional().nullable(),
      cookingKettle: z.boolean().optional().nullable(),
      cookingPlateTime: z.number().optional().nullable(),
      cookingOvenTime: z.number().optional().nullable(),
      cleaningWashingTime: z.number().optional().nullable(),
      cleaningDryerTime: z.number().optional().nullable(),
      cleaningDishwasherTime: z.number().optional().nullable(),
      refrigeratorNumber: z.number().optional().nullable(),
      freezerNumber: z.number().optional().nullable(),
      lightingSystem: z.string().optional().nullable(),
      eatingVegan: z.boolean().optional().nullable(),
      eatingVegetables: z.boolean().optional().nullable(),
      eatingDairies: z.boolean().optional().nullable(),
      eatingEggs: z.boolean().optional().nullable(),
      eatingMeat: z.boolean().optional().nullable(),
      eatingTinDrink: z.number().optional().nullable(),
      eatingZeroWaste: z.boolean().optional().nullable(),
      eatingLocal: z.boolean().optional().nullable(),
      eatingCatNumber: z.number().optional().nullable(),
      eatingDogNumber: z.number().optional().nullable(),
      eatingHorse: z.boolean().optional().nullable(),
      numericEquipment: z.boolean().optional().nullable(),
      numericWebTimeDay: z.boolean().optional().nullable(),
      numericVideoTimeDay: z.boolean().optional().nullable(),
      clothingQuantity: z.boolean().optional().nullable(),
    })
  );

  const rowsToUpdate = schema.parse(request.body);

  rowsToUpdate.forEach((personalization: any) =>
    update(personalization.id, personalization)
  );
  response.status(200).json({});
}
