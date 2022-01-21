const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../../OGREConstants");

class Facilitator extends Model {}

Facilitator.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'Facilitator',
    tableName: 'facilitator'
})

module.exports = Facilitator;