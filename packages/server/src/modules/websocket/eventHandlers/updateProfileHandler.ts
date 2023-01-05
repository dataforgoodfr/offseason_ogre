import { z } from "zod";
import { ProfileStatus } from "@prisma/client";
import { Server, Socket } from "../types";
import { services as playersServices } from "../../players/services";
import { services as profileServices } from "../../profiles/services";
import { wrapHandler } from "../utils";
import { update, create } from "../../games/services/personalization";

export { handleUpdateProfile };

function handleUpdateProfile(io: Server, socket: Socket) {
  socket.on(
    "updateProfile",
    wrapHandler(async (args: unknown) => {
      const schema = z.object({
        gameId: z.number(),
        userId: z.number(),
        update: z.object({
          profileStatus: z.string(),
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
        }),
      });

      const { gameId, userId, update: updateData } = schema.parse(args);

      const player = await playersServices.find(gameId, userId);
      const { profileStatus, ...personalizationData } = updateData;

      if (player?.profileId && player?.profile.personalizationId) {
        const personalizationId = player?.profile.personalizationId;
        await update(personalizationId, personalizationData);
        await profileServices.update(player?.profileId, {
          status: profileStatus as ProfileStatus,
          lastStatusUpdate: new Date(),
        });
      } else {
        const personalization = await create(personalizationData);
        const profile = await profileServices.create({
          personalizationId: personalization.id,
          status: profileStatus as ProfileStatus,
          lastStatusUpdate: new Date(),
        });
        await playersServices.update(gameId, userId, {
          profileId: profile?.id,
        });
      }

      const newPlayer = await playersServices.find(gameId, userId);
      const profile =
        newPlayer?.profileId &&
        (await profileServices.find(newPlayer.profileId));
      socket.emit("profileUpdated", {
        update: profile,
      });
    })
  );
}
