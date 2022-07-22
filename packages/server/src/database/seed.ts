import { database } from ".";
import { availableActions } from "../modules/actions/constants/actions";
import { Action } from "../modules/actions/types";

// eslint-disable-next-line no-console
console.log("Starting seeding...");

const actions = [...getActionInformation()] as Action[];

async function seed() {
  await database.$connect();

  await database.user.create({
    data: {
      email: "seeding@database.com",
      isTeacher: false,
      firstName: "Seeding",
      lastName: "Master",
      country: "FR",
    },
  });

  await database.action.createMany({
    data: actions,
  });

  await database.$disconnect();
}

seed().then(() => {
  // eslint-disable-next-line no-console
  console.log("Seeding done");
});

function getActionInformation(): Action[] {
  const actionsList = [
    {
      description: "Réduire ses déplacements en avion de 50%",
      name: availableActions.REDUCE_PLANE_HALF,
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Consommer local et de saison",
      name: availableActions.LOCAL_CONSUMPTION,
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Acheter deux fois moins de vêtements et chaussures",
      name: availableActions.REDUCE_CLOTHING_HALF,
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Acheter moins d'équipements numériques et uniquement d'occasion",
      name: availableActions.REDUCE_NUMERIC,
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Arrêter de consommer des produits laitiers (inutile si déjà végétalien)",
      name: availableActions.STOP_MILK,
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Arrêter de consommer des œufs (inutile si déjà végétalien)",
      name: availableActions.STOP_EGGS,
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Arrêter les boissons en cannette",
      name: availableActions.STOP_CANS,
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description:
        "Arrêter de consommer de la viande (inutile si déjà végétalien)",
      name: availableActions.STOP_MEAT,
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Passer au zéro déchet alimentaire",
      name: availableActions.ZERO_WASTE,
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description: "Réduire ses déplacements en train de 50%",
      name: availableActions.REDUCE_TRAIN_HALF,
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Pratiquer l'éco-conduite",
      name: availableActions.ECO_DRIVING,
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      description: "Réduire ses déplacements en voiture de 20%",
      name: availableActions.REDUCE_CAR_20,
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      description:
        "Passer au véhicule électrique (laisser la valeur 0 si déjà équipé)",
      name: availableActions.ELECTRIC_CAR,
      actionPointCost: 3,
      financialCost: 2.19,
    },
    {
      description: "Garder sa voiture plus de 15 ans",
      name: availableActions.KEEP_CAR_15,
      actionPointCost: 3,
      financialCost: 0,
    },
  ];
  return actionsList.map((action, index) => ({
    id: index,
    ...action,
    step: 1,
  }));
}
