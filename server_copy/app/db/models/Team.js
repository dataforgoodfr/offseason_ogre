const sequelize = require('../../config/database');
const { Model, DataTypes } = require('sequelize');

class Team extends Model {}

Team.init({ // Model attributes are defined here
    //attributes stored in DB
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    session_id: {
        type: DataTypes.INTEGER,
    }
}, { // Other model options go here
    sequelize, //connection instance
    modelName: 'Team',
    tableName: 'team'
})

module.exports = Team;