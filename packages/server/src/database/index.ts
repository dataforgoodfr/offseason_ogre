import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { connectToDatase, disconnectFromDatase, prisma };

async function connectToDatase() {
  await prisma.$connect();
}

async function disconnectFromDatase() {
  await prisma.$disconnect();
}
