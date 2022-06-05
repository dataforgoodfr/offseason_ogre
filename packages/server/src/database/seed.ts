import { database } from ".";
// const { Prisma } = require('@prisma/client')

// import { jsonDataConsumption } from "./dataConsumption"

// console.log(jsonDataConsumption);

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

	await database.personaConsumption.createMany({
		data: [
			{ version: 1, personaName: "Oil'gre", name: "consumptionElectricCar", energieType: "Décarbonée", initialValue: 0 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionTrain", energieType: "Décarbonée", initialValue: 0.73 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionNoCarbonHeating", energieType: "Décarbonée", initialValue: 0 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionAirConditionning", energieType: "Décarbonée", initialValue: 0 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionCleanCook", energieType: "Décarbonée", initialValue: 17.36 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionBrownGoods", energieType: "Décarbonée", initialValue: 7.5 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionFossilCar", energieType: "Décarbonée", initialValue: 25.41 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionPlane", energieType: "Décarbonée", initialValue: 5.57 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionFossilHeating", energieType: "Décarbonée", initialValue: 27.4 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionGreyHouse", energieType: "Décarbonée", initialValue: 3 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionGreyNumeric", energieType: "Décarbonée", initialValue: 10.72 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionGreyCar", energieType: "Décarbonée", initialValue: 42 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionGreyTransport", energieType: "Décarbonée", initialValue: 12 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionGreyOther", energieType: "Décarbonée", initialValue: 36 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionPublicService", energieType: "Décarbonée", initialValue: 7.97 },
			{ version: 1, personaName: "Oil'gre", name: "consumptionFood", energieType: "Décarbonée", initialValue: 14.9 },
		],
	});

	// await database.personaConsumption.create({
	// 	data: {
	// 		version: 1,
	// 		personaName: "Oil'gre",
	// 		extendedData: jsonDataConsumption
	// 	},
	// });

	await database.$disconnect();
}

seed().then(() => {
	// eslint-disable-next-line no-console
	console.log("Seeding done");
});
