import { Prisma } from '@prisma/client'

const jsonDataConsumption = [{
	"energy1": {
		"name": "consumptionElectricCar",
		"energieType": "Décarbonée",
		"initialValue": 0
	},
	"energy2": {
		"name": "consumptionTrain",
		"energieType": "Décarbonée",
		"initialValue": 0.73
	},
	"energy3": {
		"name": "consumptionNoCarbonHeating",
		"energieType": "Décarbonée",
		"initialValue": 0
	},
	"energy4": {
		"name": "consumptionAirConditionning",
		"energieType": "Décarbonée",
		"initialValue": 0
	},
	"energy5": {
		"name": "consumptionCleanCook",
		"energieType": "Décarbonée",
		"initialValue": 17.36
	},
	"energy6": {
		"name": "consumptionLight",
		"energieType": "Décarbonée",
		"initialValue": 4
	},
	"energy7": {
		"name": "consumptionBrownGoods",
		"energieType": "Décarbonée",
		"initialValue": 7.5
	},
	"energy8": {
		"name": "consumptionFossilCar",
		"energieType": "Décarbonée",
		"initialValue": 25.41
	},
	"energy9": {
		"name": "consumptionPlane",
		"energieType": "Décarbonée",
		"initialValue": 5.57
	},
	"energy10": {
		"name": "consumptionFossilHeating",
		"energieType": "Décarbonée",
		"initialValue": 27.4
	},
	"energy11": {
		"name": "consumptionGreyHouse",
		"energieType": "Décarbonée",
		"initialValue": 3
	},
	"energy12": {
		"name": "consumptionGreyNumeric",
		"energieType": "Décarbonée",
		"initialValue": 10.72
	},
	"energy13": {
		"name": "consumptionGreyCar",
		"energieType": "Décarbonée",
		"initialValue": 42
	},
	"energy14": {
		"name": "consumptionGreyTransport",
		"energieType": "Décarbonée",
		"initialValue": 12
	},
	"energy15": {
		"name": "consumptionGreyOther",
		"energieType": "Décarbonée",
		"initialValue": 36
	},
	"energy16": {
		"name": "consumptionPublicService",
		"energieType": "Décarbonée",
		"initialValue": 7.97
	},
	"energy17": {
		"name": "consumptionFood",
		"energieType": "Décarbonée",
		"initialValue": 14.9
	}
}] as Prisma.JsonArray


export { jsonDataConsumption }

	// energieType		String
	// version			Int
	// initialValue	Float
	// personaName		String