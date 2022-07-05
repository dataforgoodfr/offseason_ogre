import { database } from ".";

// eslint-disable-next-line no-console
console.log("Starting seeding...");

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
    data: actions
  })

  await database.$disconnect();
}

seed().then(() => {
  // eslint-disable-next-line no-console
  console.log("Seeding done");
});

import { Action } from "../modules/actions/types"

const actions = [...getActionInformation()] as Action[];

function getActionInformation(): Action[] {
  const actions = [
    {
      name: "Réduire ses déplacements en avion de 50%",
      points: 2,
      cost: 0,
    },
    {
      name: "Consommer local et de saison",
      points: 2,
      cost: 0,
    },
    {
      name: "Acheter deux fois moins de vêtements et chaussures",
      points: 2,
      cost: 0,
    },
    {
      name: "Acheter moins d'équipements numériques et uniquement d'occasion",
      points: 2,
      cost: 0,
    },
    {
      name: "Arrêter de consommer des produits laitiers (inutile si déjà végétalien)"
      ,
      points: 1,
      cost: 0,
    },
    {
      name: "Arrêter de consommer des œufs (inutile si déjà végétalien)"
      ,
      points: 1,
      cost: 0,
    },
    {
      name: "Arrêter les boissons en cannette"
      ,
      points: 1,
      cost: 0,
    },
    {
      name: "Arrêter de consommer de la viande (inutile si déjà végétalien)"
      ,
      points: 2,
      cost: 0,
    },
    {
      name: "Passer au zéro déchet alimentaire"
      ,
      points: 2,
      cost: 0,
    },
    {
      name: "Réduire ses déplacements en train de 50%"
      ,
      points: 1,
      cost: 0,
    },
    {
      name: "Pratiquer l'éco-conduite"
      ,
      points: 1,
      cost: 0,
    },
    {
      name: "Réduire ses déplacements en voiture de 20%",
      points: 2,
      cost: 0,
    },
    {
      name: "Passer au véhicule électrique (laisser la valeur 0 si déjà équipé)"
      ,
      points: 3,
      cost: 2.19,
    },
    {
      name: "Garder sa voiture plus de 15 ans",
      points: 3,
      cost: 0,
    },
  ];
  return actions.map((action) => ({
    ...action,
    step: 1,
  }));
}


