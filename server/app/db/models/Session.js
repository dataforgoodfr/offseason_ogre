/* istanbul ignore file */

const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');

class Session extends Model {}

Session.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },

}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'Session',
    tableName: 'session'
})

module.exports = Session;