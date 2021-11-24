const OGREConstants = require("../OGREConstants");

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
}

module.exports = PlaneConfiguration;