import { connectToDatase, disconnectFromDatase, seed } from ".";

async function seedDatabase() {
  await connectToDatase();
  await seed();
  await disconnectFromDatase();
}

seedDatabase();
