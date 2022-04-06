const PlaneConsumption = require('../db/models/PlaneConsumption');
const ressourceController = require('./ressourceController');
const planeController = {}

planeController.index = async(_, response, next) => {
    console.log('enter planeController.index');
    ressourceController.index(_, response, next, PlaneConsumption);
}

planeController.show = async(_, response, next) => {
    console.log('enter planeController.show');
    ressourceController.show(_, response, next, PlaneConsumption);
}

planeController.create = async(_, response, next) => {
    console.log('enter planeController.create');
    ressourceController.create(_, response, next, PlaneConsumption);
}

planeController.update = async(_, response, next) => {
    console.log('enter planeController.update');
    ressourceController.update(_, response, next, PlaneConsumption);
}

planeController.destroy = async(_, response, next) => {
    console.log('enter planeController.destroy');
    ressourceController.destroy(_, response, next, PlaneConsumption);
}

module.exports = planeController;