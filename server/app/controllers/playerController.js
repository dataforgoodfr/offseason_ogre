const { Player, PlaneConsumption } = require('../db/models');
const { CarConsumption } = require('../db/models');
const ressourceController = require('./ressourceController');
const playerController = {}

playerController.index = async(_, response, next) => {
    console.log('enter playerController.index');
    ressourceController.index(_, response, next, Player, [PlaneConsumption, CarConsumption]);
}

module.exports = playerController;