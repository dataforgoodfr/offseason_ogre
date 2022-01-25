const sequelize = require('../config/database');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../OGREConstants");

class WindTurbineOnshoreProduction extends Model {}

WindTurbineOnshoreProduction.init({// Model attributes are defined here
    //attributes stored in DB
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ratioTerritory : DataTypes.FLOAT,

    //virtual attributes which are not stored in DB
    availablePowerDay : {
        type: DataTypes.VIRTUAL,
        get() {
            return OGREConstants.windTurbineOnshoreConstants.PowerM2 / 1000 * 24 *
            OGREConstants.GlobalConstants.AreaFrance * 10**6 / OGREConstants.GlobalConstants.PopulationFrance ; 
        }
    },

    energyProductionPerDay : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.ratioTerritory * this.availablePowerDay ; 
        }
    },

    energyInstalledPower : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.energyProductionPerDay / 24 / 10**6 / OGREConstants.windTurbineOnshoreConstants.LoadFactor * 
            OGREConstants.GlobalConstants.PopulationFrance ;
        }
    },

    CO2EmissionsPerDay : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.energyProductionPerDay * OGREConstants.windTurbineOnshoreConstants.CO2EmissionsPerkWh ;
        }
    },

    costPerDay : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.energyProductionPerDay * OGREConstants.windTurbineOnshoreConstants.LCOEaverage ;
        }
    },
}, {// Other model options go here
    sequelize, //connection instance
    modelName: 'WindTurbineOnshoreProduction',
    tableName: 'windturbine-onshore_production'
})

module.exports = WindTurbineOnshoreProduction;
