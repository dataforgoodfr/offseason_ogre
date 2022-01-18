const { CarConsumption } = require('../db/models');
const ressourceController = require('./ressourceController');
const carConsumptionController = {}

carConsumptionController.index = async(_, response, next) => {
    console.log('enter carConsumptionController.index');
    ressourceController.index(_, response, next, CarConsumption);
}

carConsumptionController.show = async(_, response, next) => {
    console.log('enter carConsumptionController.show');
    ressourceController.show(_, response, next, CarConsumption);
}

carConsumptionController.create = async(_, response, next) => {
    console.log('enter carConsumptionController.create');
    ressourceController.create(_, response, next, CarConsumption);
}

carConsumptionController.update = async(_, response, next) => {
    console.log('enter carConsumptionController.update');
    ressourceController.update(_, response, next, CarConsumption);
}

carConsumptionController.destroy = async(_, response, next) => {
    console.log('enter carConsumptionController.destroy');
    ressourceController.destroy(_, response, next, CarConsumption);
}

module.exports = carConsumptionController;