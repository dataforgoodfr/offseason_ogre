const sequelize = require('../config/database');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../OGREConstants");

class PlaneConsumption extends Model {}

PlaneConsumption.init({// Model attributes are defined here
    //attributes stored in DB
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    distancePerYear : {
        type: DataTypes.INTEGER
    },

    //virtual attributes which are not stored in DB
    energyConsumptionPerYear : {
        type: DataTypes.VIRTUAL,
        get() {
            return OGREConstants.planeConstants.consumptionByPassenger * this.distancePerYear / (OGREConstants.planeConstants.distanceOneRide * 2);
        }
    },
    energyConsumptionPerDay : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.energyConsumptionPerYear / OGREConstants.daysPerYear;
        }
    },

}, {// Other model options go here
    sequelize, //connection instance
    modelName: 'PlaneConsumption',
    tableName: 'plane_consumption'
})

module.exports = PlaneConsumption;