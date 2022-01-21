/* istanbul ignore file */

const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');

class Role extends Model {}

Role.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'Role',
    tableName: 'role'
})

module.exports = Role;