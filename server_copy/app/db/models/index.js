const Player = require('./Player');
const CarConsumption = require('./CarConsumption');
const PlaneConsumption = require('./PlaneConsumption');
const Team = require('./Team');
const Session = require('./Session');
const Facilitator = require('./Facilitator');
const User = require('./User');
const Role = require('./Role');

//Associations between models are defined here

CarConsumption.hasOne(Player);
Player.belongsTo(CarConsumption);

PlaneConsumption.hasOne(Player);
Player.belongsTo(PlaneConsumption);

Player.belongsTo(Team);
Team.hasMany(Player);

Team.belongsTo(Session);
Session.hasMany(Team);

Facilitator.belongsTo(Session);
Session.hasMany(Facilitator);

User.hasOne(Player)
Player.belongsTo(User)

User.hasOne(Facilitator)
Facilitator.belongsTo(User)

User.belongsTo(Role, {
    foreignKey: 'role_id'
})
Role.hasMany(User)

module.exports = { Player, CarConsumption, PlaneConsumption, Team, Session, Facilitator, User, Role };