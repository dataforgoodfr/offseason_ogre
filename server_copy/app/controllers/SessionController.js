const Session = require('../db/models/Session');
const ressourceController = require('./ressourceController');
const sessionController = {}

sessionController.index = async(_, response, next) => {
    console.log('enter sessionController.index');
    ressourceController.index(_, response, next, Session);
}

sessionController.show = async(request, response, next) => {
    console.log('enter sessionController.show');
    ressourceController.show(request, response, next, Session);
}

sessionController.create = async(request, response, next) => {
    console.log('enter sessionController.create');
    ressourceController.create(request, response, next, Session);
}


sessionController.update = async(request, response, next) => {
        console.log('enter sessionController.update');
        ressourceController.update((request, response, next, Session);
        }

        sessionController.destroy = async(request, response, next) => {
            console.log('enter sessionController.delete');
            ressourceController.destroy(request, response, next, Session);
        }

        module.exports = sessionController;