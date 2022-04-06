import { prisma } from ".";

console.log("Starting seeding...");

async function seed() {
  await prisma.$connect();

  await prisma.user.create({ data: { email: "seeding@database.com" } });

  await prisma.$disconnect();
}

seed().then(() => {
  console.log("Seeding done");
});
