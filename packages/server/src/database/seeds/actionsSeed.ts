import { availableActions } from "../../modules/actions/constants/actions";
import { database } from "..";
import { Action } from "../../modules/actions/types";
import { Seeder } from "../types";

export { seed };

const seed: Seeder<Action> = {
  seeder: (action: Action) =>
    database.action.upsert({
      where: {
        id: action.id,
      },
      update: action,
      create: action,
    }),
  data: getActionsData(),
};

function getActionsData(): Action[] {
  return [
    ...getActionsDataForConsumptionStep1(),
    ...getActionsDataForConsumptionStep2(),
  ].map((action, index) => ({
    ...action,
    id: index,
  }));
}

function getActionsDataForConsumptionStep1(): Action[] {
  const actions = [
    {
      description: "Réduire ses déplacements en avion de 50%",
      name: availableActions.REDUCE_PLANE_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1xsTVShg7gVW0MbRoVwYKzaSDyjfwUjKl/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Consommer local et de saison",
      name: availableActions.LOCAL_CONSUMPTION,
      helpCardLink:
        "https://drive.google.com/file/d/1cWqdCf2gaRxlqiDJksn2r1eBW3YzLluV/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Acheter deux fois moins de vêtements et chaussures",
      name: availableActions.REDUCE_CLOTHING_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1_HjnnT1PReXwBZbpSkPKLxmg3150b5zy/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Acheter moins d'équipements numériques et uniquement d'occasion",
      name: availableActions.REDUCE_NUMERIC,
      helpCardLink:
        "https://drive.google.com/file/d/193t5vMEnZSM63crP_f8lcLwb-aT4QVbL/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Arrêter de consommer des produits laitiers (inutile si déjà végétalien)",
      name: availableActions.STOP_MILK,
      helpCardLink:
        "https://drive.google.com/file/d/1dnDPdDinE4RHNihhsAH0xdH7P9_hQR4d/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Arrêter de consommer des œufs (inutile si déjà végétalien)",
      name: availableActions.STOP_EGGS,
      helpCardLink:
        "https://drive.google.com/file/d/17KGVHphAIsM5qgrYrDNqBPWGR3oCi9MS/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Arrêter les boissons en canette",
      name: availableActions.STOP_CANS,
      helpCardLink:
        "https://drive.google.com/file/d/1a3osQzEObej0rXNgdLnLrq8jgeh1c_1h/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description:
        "Arrêter de consommer de la viande (inutile si déjà végétalien)",
      name: availableActions.STOP_MEAT,
      helpCardLink:
        "https://drive.google.com/file/d/16h1uaf99s1NQHyMEfJM-ASm9d_a4Zy4V/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Passer au zéro déchet alimentaire",
      name: availableActions.ZERO_WASTE,
      helpCardLink:
        "https://drive.google.com/file/d/1FqqrV9pVPr_X6sPceZ7ZnEFILlkOfN8f/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Réduire ses déplacements en train de 50%",
      name: availableActions.REDUCE_TRAIN_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/16BQ3GUx0LACvmnEvIBNiV61Ph9-1wIEs/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Pratiquer l'éco-conduite",
      name: availableActions.ECO_DRIVING,
      helpCardLink:
        "https://drive.google.com/file/d/1FS1oD5Il-j2M8NA2U7kklWc-8yC7n5wW/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Réduire ses déplacements en voiture de 20%",
      name: availableActions.REDUCE_CAR_20,
      helpCardLink:
        "https://drive.google.com/file/d/1JfswSvFEMlekhQ3ZYYmO933HFjaKJr-w/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Passer au véhicule électrique (laisser la valeur 0 si déjà équipé)",
      name: availableActions.ELECTRIC_CAR,
      helpCardLink:
        "https://drive.google.com/file/d/1x2ph5rsK-VUADEtvfuIkynQS4DC2rsO2/view?usp=share_link",
      actionPointCost: 3,

      financialCost: 2.19,
    },
    {
      description: "Garder sa voiture plus de 15 ans",
      name: availableActions.KEEP_CAR_15,
      helpCardLink:
        "https://drive.google.com/file/d/1nvK4QMe_VZzIscdd4c5jG3uQ7IdDswJe/view?usp=share_link",
      actionPointCost: 3,
      financialCost: 0,
    },
  ];
  return actions.map((action, index) => ({
    id: index,
    ...action,
    step: 1,
  }));
}

function getActionsDataForConsumptionStep2(): Action[] {
  const actions = [
    {
      description: "Trier ses déchets",
      name: availableActions.CONSUMPTION_SORT_WASTE,
      helpCardLink:
        "https://drive.google.com/file/d/1zlW9Um4AiTk6yKENGJi5PXZ6tdCG-WJ0/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Supprimer les déplacements en avion",
      name: availableActions.TRANSPORT_STOP_PLANE,
      helpCardLink:
        "https://drive.google.com/file/d/11427RQghOR7Jbo-hmmLA6mkty-0O7PId/view?usp=share_link",
      actionPointCost: 3,
      financialCost: 0,
    },
    {
      description: "Isoler les murs",
      name: availableActions.HOUSE_INSULATE_WALLS,
      helpCardLink:
        "https://drive.google.com/file/d/11iWqGde4FVYsJwUKcYCZt5k3NaKi9X4r/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 1.78,
    },
    {
      description: "Isoler la toiture",
      name: availableActions.HOUSE_INSULATE_ROOF,
      helpCardLink:
        "https://drive.google.com/file/d/1jnh9UhhADO-vopQwvWtWsobs9dY3niTG/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0.89,
    },
    {
      description: "Changer les menuiseries (fenêtres)",
      name: availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS,
      helpCardLink:
        "https://drive.google.com/file/d/1Wh8t39PBC6IdUy_ByNAo6OLFtQ4_1FSj/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0.69,
    },
    {
      description: "Mettre un système de ventilation performant",
      name: availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM,
      helpCardLink:
        "https://drive.google.com/file/d/1ORl_tkkT4D75YQ-K3h5ma5dgo1gGzrdU/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0.57,
    },
    {
      description: "Installer un chauffage élec/bois performant",
      name: availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM,
      helpCardLink:
        "https://drive.google.com/file/d/1lahrX7EQCiGlOPmylcPqI_7ytAp0DCJI/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 2.85,
    },
    {
      description: "Vivre dans un logement à 19°C maximum",
      name: availableActions.HOUSE_19_DEGREES_MAX,
      helpCardLink:
        "https://drive.google.com/file/d/1u9BgdS22UXraNFxNAEINCrnkHq8OMZZx/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Vivre dans un logement 2 fois plus petit",
      name: availableActions.HOUSE_REDUCE_SIZE_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1PpkLPFUjTKK7RAdari_88wM-u-xJ1F25/view?usp=share_link",
      actionPointCost: 3,
      financialCost: 0,
    },
    {
      description: "Arrêter la climatisation",
      name: availableActions.HOUSE_STOP_AIR_CONDITIONING,
      helpCardLink:
        "https://drive.google.com/file/d/1bbZK-rxQJoI3-8CgGD59VmoRoEtlO2gt/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Uniquement des ampoules LED",
      name: availableActions.HOUSE_ONLY_LEDS,
      helpCardLink:
        "https://drive.google.com/file/d/1IU04I8c8ZfX6pqHmguleEPbYN2Gh4G3c/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Une douche par jour de moins de 5 minutes",
      name: availableActions.HOUSE_ONE_SHOWER_5_MINUTES_MAX,
      helpCardLink:
        "https://drive.google.com/file/d/1hNDeP_-BrW6jcwre6heV3JyHqghxguvg/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Réduire de 50% ses usages Internet (dont vidéos)",
      name: availableActions.DIGITAL_REDUCE_INTERNET_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1l8oXs2DycpBu-JPycUChRqpLyp1vnH7M/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Uniquement de l'électroménager performant (A+++)",
      name: availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES,
      helpCardLink:
        "https://drive.google.com/file/d/1IriXin5FAGjpSfqMySzCrVbMzZjP8dxA/view?usp=share_link",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Débrancher les appareils en veille",
      name: availableActions.HOUSE_UNPLUNG_APPLIANCES_ON_STANDBY,
      helpCardLink:
        "https://drive.google.com/file/d/1jPS4oWZD3_nJHh_BoTo8tVle8HClvcOL/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Débrancher les chargeurs",
      name: availableActions.HOUSE_UNPLUNG_CHARGERS,
      helpCardLink:
        "https://drive.google.com/file/d/1tAa8_owb2uF3Ly_UlTtCq5cx4CUY13N-/view?usp=share_link",
      actionPointCost: 1,
      financialCost: 0,
    },
  ];
  return actions.map((action, index) => ({
    id: index,
    ...action,
    step: 3,
  }));
}
