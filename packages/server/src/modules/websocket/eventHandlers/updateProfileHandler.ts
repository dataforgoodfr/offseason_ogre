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
    wrapHandler(async (args: unknown, respond: (...argz: any[]) => void) => {
      const schema = z.object({
        gameId: z.number(),
        userId: z.number(),
        update: z.object({
          profileStatus: z.string(),
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
      respond({ success: true });
    })
  );
}
