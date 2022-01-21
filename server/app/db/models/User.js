/* istanbul ignore file */

const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');

class User extends Model {}

User.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    first_name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    last_name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING
    },
}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'User',
    tableName: 'users'
})

module.exports = User;