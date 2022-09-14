import { database } from ".";
import { seed as usersSeed } from "./seeds/usersSeed";
import { seed as actionsSeed } from "./seeds/actionsSeed";
import { seed as productionActionsSeed } from "./seeds/productionActionsSeed";
import { performSeed } from "./utils";

// eslint-disable-next-line no-console
console.log("Starting seeding...");

async function seed() {
  await database.$connect();

  await performSeed(usersSeed);
  await performSeed(actionsSeed);
  await performSeed(productionActionsSeed);

  await database.$disconnect();
}

seed().then(() => {
  // eslint-disable-next-line no-console
  console.log("Seeding done");
});
