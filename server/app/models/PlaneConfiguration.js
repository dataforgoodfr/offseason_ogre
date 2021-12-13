const OGREConstants = require("../OGREConstants");
const db = require('../database');

class PlaneConfiguration {
    id;
    distancePerYear;
    energyConsumptionPerYear;
    energyConsumptionPerDay;

    constructor(data) {
        this.id = data.id;
        this.distancePerYear = data.distancePerYear;
    }

    computeEnergyConsumptionPerYear() {
        this.energyConsumptionPerYear = OGREConstants.planeConstants.CONSUMPTION_BY_PASSENGER * this.distancePerYear / (OGREConstants.planeConstants.DISTANCE_1_RIDE * 2);
    }

    computeEnergyConsumptionPerDay() {
        this.energyConsumptionPerDay = this.energyConsumptionPerYear / OGREConstants.daysPerYear;
    }

    get energyConsumptionPerDay() {
        return this.energyConsumptionPerDay;
    }

    static async findAll() {
        const query = `SELECT * FROM plane_config;`;
        try {
            const result = await db.query(query);
            let plane_configs = [];
            for (const row of result.rows) {
                // on transforme la donnée brute de la query sql en instance de PlaneConfiguration
                const plane_config = new PlaneConfiguration(row);
                plane_configs.push(plane_config);
            }
            return plane_configs;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = PlaneConfiguration;