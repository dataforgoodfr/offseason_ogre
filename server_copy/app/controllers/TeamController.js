const Team = require('../db/models/Team');
const ressourceController = require('./ressourceController');
const teamController = {}

teamController.index = async(_, response, next) => {
    console.log('enter teamController.index');
    ressourceController.index(_, response, next, Team);
}

teamController.show = async(request, response, next) => {
    console.log('enter teamController.show');
    ressourceController.show(request, response, next, Team);
}

teamController.create = async(request, response, next) => {
    console.log('enter teamController.create');
    ressourceController.create(request, response, next, Team);
}

teamController.update = async(request, response, next) => {
        console.log('enter teamController.update');
        ressourceController.update((request, response, next, Team);
        }

        teamController.destroy = async(request, response, next) => {
            console.log('enter teamController.delete');
            ressourceController.destroy(request, response, next, Team);
        }

        module.exports = teamController;