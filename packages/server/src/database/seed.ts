import { database } from ".";
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
      name: "Réduire ses déplacements en avion de 50%",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      name: "Consommer local et de saison",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      name: "Acheter deux fois moins de vêtements et chaussures",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      name: "Acheter moins d'équipements numériques et uniquement d'occasion",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      name: "Arrêter de consommer des produits laitiers (inutile si déjà végétalien)",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      name: "Arrêter de consommer des œufs (inutile si déjà végétalien)",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      name: "Arrêter les boissons en cannette",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      name: "Arrêter de consommer de la viande (inutile si déjà végétalien)",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      name: "Passer au zéro déchet alimentaire",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      name: "Réduire ses déplacements en train de 50%",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      name: "Pratiquer l'éco-conduite",
      actionPointCost: 1,
      financialCost: 0,
    },
    {
      name: "Réduire ses déplacements en voiture de 20%",
      actionPointCost: 2,
      financialCost: 0,
    },
    {
      name: "Passer au véhicule électrique (laisser la valeur 0 si déjà équipé)",
      actionPointCost: 3,
      financialCost: 2.19,
    },
    {
      name: "Garder sa voiture plus de 15 ans",
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
