const { Player, PlaneConsumption } = require('../db/models');
const { CarConsumption } = require('../db/models');
const ressourceController = require('./ressourceController');
const playerController = {}

playerController.index = async(_, response, next) => {
    console.log('enter playerController.index');
    ressourceController.index(_, response, next, Player, [PlaneConsumption, CarConsumption]);
}

playerController.show = async(_, response, next) => {
    console.log('enter playerController.show');
    ressourceController.show(_, response, next, Player, [PlaneConsumption, CarConsumption]);
}

playerController.create = async(_, response, next) => {
    console.log('enter playerController.create');
    ressourceController.create(_, response, next, Player);
}

playerController.update = async(_, response, next) => {
    console.log('enter playerController.update');
    ressourceController.update(_, response, next, Player);
}

playerController.destroy = async(_, response, next) => {
    console.log('enter playerController.destroy');
    ressourceController.destroy(_, response, next, Player);
}

module.exports = playerController;
