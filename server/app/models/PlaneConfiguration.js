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

    set energyConsumptionPerYear() {
        this.energyConsumptionPerYear = OGREConstants.PlaneConstants.CONSUMPTION_BY_PASSENGER * this.distancePerYear / (OGREConstants.PlaneConstants.DISTANCE_1_RIDE * 2);
    }

    set energyConsumptionPerDay() {
        this.energyConsumptionPerDay = this.energyConsumptionPerYear / OGREConstants.daysPerYear;
    }

    get energyConsumptionPerDay() {
        return this.energyConsumptionPerDay;
    }
}

module.exports = PlaneConfiguration;