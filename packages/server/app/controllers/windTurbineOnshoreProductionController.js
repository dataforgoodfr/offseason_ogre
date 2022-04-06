const WindTurbineOnshoreProduction = require('../db/models/WindTurbineOnshoreProduction');
const ressourceController = require('./ressourceController');
const windTurbineOnshoreController = {}

windTurbineOnshoreController.index = async(_, response, next) => {
    console.log('enter windTurbineOnshoreController.index');
    ressourceController.index(_, response, next, WindTurbineOnshoreProduction);
}

windTurbineOnshoreController.show = async(_, response, next) => {
    console.log('enter windTurbineOnshoreController.show');
    ressourceController.show(_, response, next, WindTurbineOnshoreProduction);
}

windTurbineOnshoreController.create = async(_, response, next) => {
    console.log('enter windTurbineOnshoreController.create');
    ressourceController.create(_, response, next, WindTurbineOnshoreProduction);
}

windTurbineOnshoreController.update = async(_, response, next) => {
    console.log('enter windTurbineOnshoreController.update');
    ressourceController.update(_, response, next, WindTurbineOnshoreProduction);
}

windTurbineOnshoreController.destroy = async(_, response, next) => {
    console.log('enter windTurbineOnshoreController.destroy');
    ressourceController.destroy(_, response, next, WindTurbineOnshoreProduction);
}

module.exports = windTurbineOnshoreController;
