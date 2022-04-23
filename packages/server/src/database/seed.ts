import { prisma } from ".";

// eslint-disable-next-line no-console
console.log("Starting seeding...");

async function seed() {
  await prisma.$connect();

  await prisma.user.create({
    data: {
      email: "seeding@database.com",
      isTeacher: false,
      firstName: "Seeding",
      lastName: "Master",
      country: "FR",
    },
  });

  await prisma.$disconnect();
}

seed().then(() => {
  // eslint-disable-next-line no-console
  console.log("Seeding done");
});
