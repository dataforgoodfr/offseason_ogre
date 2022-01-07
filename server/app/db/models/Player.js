const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../../OGREConstants");

class Player extends Model {}

Player.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    adultsPerHousehold: {
        type: DataTypes.INTEGER
    },
    childrenPerHousehold: {
        type: DataTypes.INTEGER
    },

    //virtual attributes which are not stored in DB
    personsPerHousehold: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.adultsPerHousehold + this.childrenPerHousehold;
        }
    },

}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'Player',
    tableName: 'player'
})

module.exports = Player;