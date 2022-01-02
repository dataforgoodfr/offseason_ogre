const sequelize = require('../config/databasebis');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../OGREConstants");

class CarConsumption extends Model {}

CarConsumption.init({// Model attributes are defined here
    //attributes stored in DB
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    hasCar : DataTypes.BOOLEAN,
    carShareDistance : DataTypes.INTEGER,
    aloneDistance : DataTypes.INTEGER,
    withHouseholdDistance : DataTypes.INTEGER,
    litresPer100km : DataTypes.INTEGER,
    motorType : DataTypes.INTEGER,

    //virtual attributes which are not stored in DB
    personsPerHousehold : {
        type: DataTypes.VIRTUAL,
        get() {
            return 4;
        }
    },
    dailyAloneDistance : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.aloneDistance / 365;
        }
    },
    dailyWithHouseholdDistance : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.withHouseholdDistance / 365;
        }
    },
    distancePerLiter : {
        type: DataTypes.VIRTUAL,
        get() {
            return 100/this.litresPer100km;
        }
    },
    aloneConsumption : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.dailyAloneDistance * OGREConstants.CALORIFIC_VALUE / this.distancePerLiter;
        }
    },
    withHouseholdConsumption : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.dailyWithHouseholdDistance * OGREConstants.CALORIFIC_VALUE / this.distancePerLiter / this.personsPerHousehold;
        }
    },
    dailycarShareDistance : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.carShareDistance / 365;
        }
    },
    carShareConsumption : {
        type: DataTypes.VIRTUAL,
        get() {
            return this.dailycarShareDistance * OGREConstants.CALORIFIC_VALUE / this.distancePerLiter;
        }
    },
    carConsumption : {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.hasCar)
                return this.withHouseholdConsumption + this.aloneConsumption;
            else
                return this.carShareConsumption;
        }
    },

}, {// Other model options go here
    sequelize, //connection instance
    modelName: 'CarConsumption',
    tableName: 'car_consumption'
})

module.exports = CarConsumption;