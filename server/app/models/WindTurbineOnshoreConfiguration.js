const OGREConstants = require("../OGREConstants");

class WindTurbineOnshoreConfiguration {
    id;
    ratioTerritory;
    energyProductionPerDay;
    energyInstalledPower
    CO2EmissionsPerDay;
    costPerDay;
    availablePowerDay;

    constructor(data) {
        this.id = data.id;
        this.ratioTerritory = data.ratioTerritory;
    }

    computeAvailablePowerDay() {
        this.availablePowerDay = OGREConstants.windTurbineOnshoreConstants.PowerM2 / 1000 * 24 *
                                    OGREConstants.GlobalConstants.AreaFrance * 10**6 / OGREConstants.GlobalConstants.PopulationFrance ;
    }

    computeEnergyProductionPerDay() {
        this.energyProductionPerDay = this.ratioTerritory * this.availablePowerDay;
    }

    computeEnergyInstalledPower() {
        this.energyInstalledPower = this.energyProductionPerDay / 24 / 10**6 / OGREConstants.windTurbineOnshoreConstants.ChargeFactor * 
                                        OGREConstants.GlobalConstants.PopulationFrance ;
    }

    computeCO2EmissionsPerDay() {
        this.CO2EmissionsPerDay = this.energyProductionPerDay * OGREConstants.windTurbineOnshoreConstants.CO2EmissionsPerkWh;
    }

    computeCostPerDay() {
        this.costPerDay = this.energyProductionPerDay * OGREConstants.windTurbineOnshoreConstants.LCOEaverage ;
    }

    get energyProductionPerDay() {
        return this.energyProductionPerDay;
    }

    get energyInstalledPower() {
        return this.energyInstalledPower;
    }

    get CO2EmissionsPerDay() {
        return this.CO2EmissionsPerDay;
    }

    get costPerDay() {
        return this.costPerDay;
    }
}

module.exports = WindTurbineOnshoreConfiguration;
