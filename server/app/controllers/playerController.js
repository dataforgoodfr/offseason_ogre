const { Player, PlaneConsumption } = require('../db/models');
const { CarConsumption } = require('../db/models');
const ressourceController = require('./ressourceController');
const playerController = {}

playerController.allPlayers = async(_, response, next) => {
    console.log('enter playerController.allPlayers');
    ressourceController.allRessources(_, response, next, Player, [PlaneConsumption, CarConsumption]);
}

module.exports = playerController;