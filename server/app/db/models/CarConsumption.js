const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../../OGREConstants");

class CarConsumption extends Model {}

CarConsumption.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    hasCar: DataTypes.BOOLEAN,
    carShareDistance: DataTypes.INTEGER,
    aloneDistance: DataTypes.INTEGER,
    withHouseholdDistance: DataTypes.INTEGER,
    litresPer100km: {
        type: DataTypes.FLOAT,
        get() { //getter to adapt value with motortype if no initial value was provided
            const rawValue = this.getDataValue('litresPer100km');
            if (!rawValue){
                if (this.motorType != 3 ) { //motorType : 3 => electricity
                    return 7;
                } else {
                    return 4.5;
                }
            }
            return rawValue;
        }
    },
    motorType: DataTypes.INTEGER,

    //virtual attributes which are not stored in DB
    personsPerHousehold: {
        type: DataTypes.VIRTUAL,
        get() {
            return 4;
        }
    },
    dailyAloneDistance: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.aloneDistance / 365;
        }
    },
    dailyWithHouseholdDistance: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.withHouseholdDistance / 365;
        }
    },
    distancePerLiter: {
        type: DataTypes.VIRTUAL,
        get() {
            return 100 / this.litresPer100km;
        }
    },
    aloneConsumption: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.dailyAloneDistance * OGREConstants.carConstants.CALORIFIC_VALUE / this.distancePerLiter;
        }
    },
    withHouseholdConsumption: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.dailyWithHouseholdDistance * OGREConstants.carConstants.CALORIFIC_VALUE / this.distancePerLiter / this.personsPerHousehold;
        }
    },
    dailycarShareDistance: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.carShareDistance / 365;
        }
    },
    carShareConsumption: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.dailycarShareDistance * OGREConstants.carConstants.CALORIFIC_VALUE / this.distancePerLiter;
        }
    },
    carConsumption: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.hasCar)
                return this.withHouseholdConsumption + this.aloneConsumption;
            else
                return this.carShareConsumption;
        }
    },

}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'CarConsumption',
    tableName: 'car_consumption'
})

module.exports = CarConsumption;
