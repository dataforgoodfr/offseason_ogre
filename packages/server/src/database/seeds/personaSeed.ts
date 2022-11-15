import {
  Personalization,
  PersonalizationName,
  PersonalizationType,
} from "@prisma/client";
import { database } from "..";
import { Seed } from "../types";

export { seed };

const seed: Seed<Omit<Personalization, "id" | "updatedAt">> = {
  seeder: (persona: Omit<Personalization, "id" | "updatedAt">) =>
    database.personalization.upsert({
      where: {
        personalizationType_personalizationName_createdAt: {
          personalizationType: persona.personalizationType,
          personalizationName: persona.personalizationName,
          createdAt: new Date("01-01-1970"),
        },
      },
      update: persona,
      create: persona,
    }),
  data: getPersonaData(),
};

function getPersonaData(): Omit<Personalization, "id" | "updatedAt">[] {
  const persona = [
    {
      personalizationType: "predefinedPersona" as PersonalizationType,
      personalizationName: "oilgre" as PersonalizationName,
      numberAdults: 2,
      numberKids: 2,
      car: true,
      carEnergy: "Diesel",
      carConsumption: 7,
      carDistanceAlone: 12000,
      carDistanceHoushold: 5000,
      carAge: "Moins de 5 ans",
      carDistanceCarsharing: 0,
      planeDistance: 5000,
      trainDistance: 2000,
      houseType: "Maison mitoyenne",
      houseSurface: 100,
      heatingEnergy: "Gaz",
      heatingConsumption: 20000,
      heatingInvoice: 0,
      heatPump: false,
      heatingTemperature: true,
      airConditionning: false,
      aCRoomNb: 0,
      aCDaysNb: 0,
      showerBath: "Douches",
      showerNumber: 1,
      showerTime: "5 à 10 minutes",
      cookingKettle: true,
      cookingPlateTime: 1,
      cookingOvenTime: 1,
      cleaningWashingTime: 1,
      cleaningDryerTime: 0,
      cleaningDishwasherTime: 1,
      refrigeratorNumber: 1,
      freezerNumber: 1,
      lightingSystem: "Ampoules basse consommation",
      eatingVegan: false,
      eatingVegetables: true,
      eatingDairies: true,
      eatingEggs: true,
      eatingMeat: true,
      eatingTinDrink: 0,
      eatingZeroWaste: false,
      eatingLocal: false,
      eatingCatNumber: 0,
      eatingDogNumber: 0,
      eatingHorse: false,
      numericEquipment: true,
      numericWebTimeDay: true,
      numericVideoTimeDay: true,
      clothingQuantity: true,
      createdAt: new Date("01-01-1970"),
    },
  ];

  return persona;
}
