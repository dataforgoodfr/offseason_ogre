const Player = require('./Player');
const CarConsumption = require('./CarConsumption');
const PlaneConsumption = require('./PlaneConsumption');
const User = require('./User');
const Role = require('./Role');

//Associations between models are defined here

Player.hasOne(CarConsumption);
CarConsumption.belongsTo(Player);

Player.hasOne(PlaneConsumption);
PlaneConsumption.belongsTo(Player);

Role.hasMany(User, {
    as: "users",
    foreignKey: {
        name: "role_id",
        allowNull: false,
        defaultValue: 3
    }
});
User.belongsTo(Role, {
    as: "role",
    foreignKey: "role_id"
});

module.exports = { Player, CarConsumption, PlaneConsumption, User, Role };
