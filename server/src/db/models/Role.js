const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../../OGREConstants");

class Role extends Model {}

Role.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'Role',
    tableName: 'role'
})

module.exports = Role;