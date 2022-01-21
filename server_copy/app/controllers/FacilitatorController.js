const Facilitator = require('../db/models/Facilitator');
const ressourceController = require('./ressourceController');

const facilitatorController = {}

facilitatorController.index = async(_, response, next) => {
    console.log('enter facilitatorController.index');
    ressourceController.index(_, response, next, Facilitator);
}

facilitatorController.show = async(_, response, next) => {
    console.log('enter facilitatorController.show');
    ressourceController.show(_, response, next, Facilitator);
}

facilitatorController.create = async(_, response, next) => {
    console.log('enter facilitatorController.create');
    ressourceController.creatense, next, Facilitator);
}

facilitatorController.update = async(_, response, next) => {
    console.log('enter facilitatorController.update');
    ressourceController.update(_, response, next, Facilitator);
}

facilitatorController.destroy = async(_, response, next) => {
    console.log('enter facilitatorController.destroy');
    ressourceController.destroy(_, response, next, Facilitator);
}

module.exports = facilitatorController;