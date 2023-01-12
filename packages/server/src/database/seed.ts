import { database } from ".";
import { seed as rolesSeed } from "./seeds/rolesSeed";
import { seed as usersSeed } from "./seeds/usersSeed";
import { seed as personaSeed } from "./seeds/personaSeed";
import { seed as actionsSeed } from "./seeds/actionsSeed";
import {
  seed as productionActionsSeed,
  pointsIntervalSeed,
} from "./seeds/productionActionsSeed";
import { performSeed } from "./utils";

// eslint-disable-next-line no-console
console.log("Starting seeding...");

async function seed() {
  await database.$connect();

  await performSeed(rolesSeed);
  await performSeed(usersSeed);
  await performSeed(personaSeed);
  await performSeed(actionsSeed);
  await performSeed(productionActionsSeed);
  await performSeed(pointsIntervalSeed);

  await database.$disconnect();
}

seed().then(() => {
  // eslint-disable-next-line no-console
  console.log("Seeding done");
});
