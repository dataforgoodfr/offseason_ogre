import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export { connectToDatase, disconnectFromDatase, prismaClient as database };

async function connectToDatase() {
  await prismaClient.$connect();
}

async function disconnectFromDatase() {
  await prismaClient.$disconnect();
}
