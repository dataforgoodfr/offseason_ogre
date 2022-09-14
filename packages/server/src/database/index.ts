import { PrismaClient } from "@prisma/client";
import { performSeed } from "./utils";
import { seed as usersSeed } from "./seeds/usersSeed";
import { seed as actionsSeed } from "./seeds/actionsSeed";
import { seed as productionActionsSeed } from "./seeds/productionActionsSeed";
import { logger } from "../logger";

const prismaClient = new PrismaClient();

export {
  connectToDatase,
  disconnectFromDatase,
  prismaClient as database,
  seed,
};

async function connectToDatase() {
  await prismaClient.$connect();
}

async function disconnectFromDatase() {
  await prismaClient.$disconnect();
}

async function seed() {
  logger.info("Seeding database");
  await performSeed(usersSeed);
  await performSeed(actionsSeed);
  await performSeed(productionActionsSeed);
  logger.info("Database seeded successfully");
}
