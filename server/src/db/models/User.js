const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');
const OGREConstants = require("../../OGREConstants");

class User extends Model {}

User.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }, 
    password: {
        type: DataTypes.STRING,
    }
}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'User',
    tableName: 'user'
})

module.exports = User;