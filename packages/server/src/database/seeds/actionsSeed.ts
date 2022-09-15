import { availableActions } from "../../modules/actions/constants/actions";
import { database } from "..";
import { Action } from "../../modules/actions/types";
import { Seed } from "../types";

export { seed };

const seed: Seed<Action> = {
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
  ];
}

function getActionsDataForConsumptionStep1(): Action[] {
  const actions = [
    {
      description: "Réduire ses déplacements en avion de 50%",
      name: availableActions.REDUCE_PLANE_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1o8og6uawrINEJKj55vndLjxSnHBTO731/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Consommer local et de saison",
      name: availableActions.LOCAL_CONSUMPTION,
      helpCardLink:
        "https://drive.google.com/file/d/1314uo7ir07rpqAsz7fCfyTCXmjip69Jn/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Acheter deux fois moins de vêtements et chaussures",
      name: availableActions.REDUCE_CLOTHING_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1c00purj7qEyHKZcGNdqOxDqXM_Koxhbq/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Acheter moins d'équipements numériques et uniquement d'occasion",
      name: availableActions.REDUCE_NUMERIC,
      helpCardLink:
        "https://drive.google.com/file/d/1_CEiKPAlSqnRrwHCM_J19O-ucwg6hluV/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Arrêter de consommer des produits laitiers (inutile si déjà végétalien)",
      name: availableActions.STOP_MILK,
      helpCardLink:
        "https://drive.google.com/file/d/1Ivyl3ZtLYPJL6qlEgRqFPj3gbq5aL4m7/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Arrêter de consommer des œufs (inutile si déjà végétalien)",
      name: availableActions.STOP_EGGS,
      helpCardLink:
        "https://drive.google.com/file/d/1YZ31Sc048Gz4YPl9WZ3BTh81LFSR1nkP/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Arrêter les boissons en cannette",
      name: availableActions.STOP_CANS,
      helpCardLink:
        "https://drive.google.com/file/d/1FTlgA5K4Oj529DaC9WEMhcjea6vxIB4d/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description:
        "Arrêter de consommer de la viande (inutile si déjà végétalien)",
      name: availableActions.STOP_MEAT,
      helpCardLink:
        "https://drive.google.com/file/d/10vFPVtlJaQByCi1LJNLiZUoKQwAnpGfM/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Passer au zéro déchet alimentaire",
      name: availableActions.ZERO_WASTE,
      helpCardLink:
        "https://drive.google.com/file/d/1Ll9VaqNQpYss9hbjzVwQHNPel-3w1HsL/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Réduire ses déplacements en train de 50%",
      name: availableActions.REDUCE_TRAIN_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1qIn1WGJ3vmx0f1X26Q6tRbmdrrUYqo4r/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Pratiquer l'éco-conduite",
      name: availableActions.ECO_DRIVING,
      helpCardLink:
        "https://drive.google.com/file/d/1dU53aruZq6HOL1HobmJPokV51aeejw5G/view",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Réduire ses déplacements en voiture de 20%",
      name: availableActions.REDUCE_CAR_20,
      helpCardLink:
        "https://drive.google.com/file/d/1hLnapQjnsYWg8sKRufi1fi4izn_UFXEI/view",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Passer au véhicule électrique (laisser la valeur 0 si déjà équipé)",
      name: availableActions.ELECTRIC_CAR,
      helpCardLink:
        "https://drive.google.com/file/d/1g4PS6TGYgDnsVlZwgCu38u6FUbTZle1l/view",
      actionPointCost: 3,
      financialCost: 2.19,
    },
    {
      description: "Garder sa voiture plus de 15 ans",
      name: availableActions.KEEP_CAR_15,
      helpCardLink:
        "https://drive.google.com/file/d/1RKoo_seg5pyQf0YDLIYLGtNOnu_eEHI0/view?usp=sharing",
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
        "https://drive.google.com/file/d/1ZNHdRR52nVwGm8LJICkxqbZ2yZ9rilg5/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Supprimer les déplacements en avion",
      name: availableActions.TRANSPORT_STOP_PLANE,
      helpCardLink:
        "https://drive.google.com/file/d/11wD5YIsyjyrLfjnJOPwhHHMrmQnJs2VC/view?usp=sharing",
      actionPointCost: 3,
      financialCost: 0,
    },
    {
      description: "Isoler les murs",
      name: availableActions.HOUSE_INSULATE_WALLS,
      helpCardLink:
        "https://drive.google.com/file/d/12ZMvTij4dQCkUmLVcZP6AcqcIRVdGVT1/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 1.78,
    },
    {
      description: "Isoler la toiture",
      name: availableActions.HOUSE_INSULATE_ROOF,
      helpCardLink:
        "https://drive.google.com/file/d/1Vv7RkWoNiv-j0itAiWf38vEmlzFGKulv/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0.89,
    },
    {
      description: "Changer les menuiseries (fenêtres)",
      name: availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS,
      helpCardLink:
        "https://drive.google.com/file/d/1mpuu02kOdBCglW9Vdn3_zyhKAaouyV6b/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0.69,
    },
    {
      description: "Mettre un système de ventilation performant",
      name: availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM,
      helpCardLink:
        "https://drive.google.com/file/d/1jtcNJZlbHSHEFM94ELdycJ05775PpyOU/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0.57,
    },
    {
      description: "Installer un chauffage élec/bois performant",
      name: availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM,
      helpCardLink:
        "https://drive.google.com/file/d/1xJoKdThri7juZW4yPIC-g54xrQTo4433/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 2.85,
    },
    {
      description: "Vivre dans un logement à 19°C maximum",
      name: availableActions.HOUSE_19_DEGREES_MAX,
      helpCardLink:
        "https://drive.google.com/file/d/1VcnnafKco94LCDcNyyd9QNB7IaeqQ3OP/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Vivre dans un logement 2 fois plus petit",
      name: availableActions.HOUSE_REDUCE_SIZE_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/17CnmJ-zIRsyV_J3TNoHra7NhC9OBczv-/view?usp=sharing",
      actionPointCost: 3,
      financialCost: 0,
    },
    {
      description: "Arrêter la climatisation",
      name: availableActions.HOUSE_STOP_AIR_CONDITIONING,
      helpCardLink:
        "https://drive.google.com/file/d/1kf5EYmAD0rTNxkA-OjlyEd4_Z1kLhdZB/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Uniquement des ampoules LED",
      name: availableActions.HOUSE_ONLY_LEDS,
      helpCardLink:
        "https://drive.google.com/file/d/1NPLf-pbYnhUqM3cR57KcSYA9k-ciXnAC/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Une douche par jour de moins de 5 minutes",
      name: availableActions.HOUSE_ONE_SHOWER_5_MINUTES_MAX,
      helpCardLink:
        "https://drive.google.com/file/d/1uPLfQs7Wc5ZDnJmpN4qyIKSbrgxcQwUt/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Réduire de 50% ses usages Internet (dont vidéos)",
      name: availableActions.DIGITAL_REDUCE_INTERNET_HALF,
      helpCardLink:
        "https://drive.google.com/file/d/1DuJneNccDyjg_QtA7Btui-tUwdmfFd01/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Uniquement de l'électroménager performant (A+++)",
      name: availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES,
      helpCardLink:
        "https://drive.google.com/file/d/1I582L5SFo1p4Hi5fT954E5QdloHy4eVK/view?usp=sharing",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Débrancher les appareils en veille",
      name: availableActions.HOUSE_UNPLUNG_APPLIANCES_ON_STANDBY,
      helpCardLink:
        "https://drive.google.com/file/d/1wxUkBc9s7Bvjwu-6l0RfM6y7jLoqfGmZ/view?usp=sharing",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Débrancher les chargeurs",
      name: availableActions.HOUSE_UNPLUNG_CHARGERS,
      helpCardLink:
        "https://drive.google.com/file/d/1xElUTrG69kqOfQJmZ7lFVhb-7UNiKdzq/view?usp=sharing",
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
