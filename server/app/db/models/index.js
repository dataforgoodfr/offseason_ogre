const Player = require('./Player');
const CarConsumption = require('./CarConsumption');
const PlaneConsumption = require('./PlaneConsumption');

//Associations between models are defined here

CarConsumption.hasOne(Player);
Player.belongsTo(CarConsumption);

PlaneConsumption.hasOne(Player);
Player.belongsTo(PlaneConsumption);

module.exports = { Player, CarConsumption, PlaneConsumption};