const OGREConstants = require("../../OGREConstants");

class WindTurbineOnshoreProduction extends Model {}

WindTurbineOnshoreProduction.init(
  {
    // Model attributes are defined here
    //attributes stored in DB
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ratioTerritory: DataTypes.FLOAT,

    //virtual attributes which are not stored in DB
    availablePowerPerDay: {
      type: DataTypes.VIRTUAL,
      get() {
        return (
          ((OGREConstants.windTurbineOnshoreConstants.powerPerM2 / 1000) *
            24 *
            OGREConstants.globalConstants.areaFrance *
            10 ** 6) /
          OGREConstants.globalConstants.populationFrance
        );
      },
    },

    energyProductionPerDay: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.ratioTerritory * this.availablePowerPerDay;
      },
    },

    energyInstalledPower: {
      type: DataTypes.VIRTUAL,
      get() {
        return (
          (this.energyProductionPerDay /
            24 /
            10 ** 6 /
            OGREConstants.windTurbineOnshoreConstants.loadFactor) *
          OGREConstants.globalConstants.populationFrance
        );
      },
    },

    CO2EmissionsPerDay: {
      type: DataTypes.VIRTUAL,
      get() {
        return (
          this.energyProductionPerDay *
          OGREConstants.windTurbineOnshoreConstants.CO2EmissionsPerkWh
        );
      },
    },

    costPerDay: {
      type: DataTypes.VIRTUAL,
      get() {
        return (
          this.energyProductionPerDay *
          OGREConstants.windTurbineOnshoreConstants.averageLCOE
        );
      },
    },
  },
  {
    // Other model options go here
    sequelize, //connection instance
    modelName: "WindTurbineOnshoreProduction",
    tableName: "wind_turbine_onshore_production",
  }
);

module.exports = WindTurbineOnshoreProduction;
