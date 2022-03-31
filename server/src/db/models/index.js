const Player = require('./Player');
const CarConsumption = require('./CarConsumption');
const PlaneConsumption = require('./PlaneConsumption');

//Associations between models are defined here

Player.hasOne(CarConsumption);
CarConsumption.belongsTo(Player);

Player.hasOne(PlaneConsumption);
PlaneConsumption.belongsTo(Player);

module.exports = { Player, CarConsumption, PlaneConsumption};
