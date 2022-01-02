const Player = require('./Player');
const CarConsumption = require('./CarConsumption');

//Associations between models are defined here

CarConsumption.hasOne(Player);
Player.belongsTo(CarConsumption);

module.exports = { Player, CarConsumption};