import { database } from ".";

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

	await database.$disconnect();
}

seed().then(() => {
	// eslint-disable-next-line no-console
	console.log("Seeding done");
});
