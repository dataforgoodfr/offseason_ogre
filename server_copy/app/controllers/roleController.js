/* istanbul ignore file */

const Role = require('../db/models/Role');
const ressourceController = require('./ressourceController');
const roleController = {}

roleController.allRoles = async(_, response, next) => {
    console.log('enter roleController.allRoles');
    ressourceController.index(_, response, next, Role);
}

roleController.getRole = async(request, response, next) => {
    console.log('enter roleController.getRole');
    ressourceController.show(request, response, next, Role);
}

roleController.createRole = async(request, response, next) => {
    console.log('enter roleController.createRole');
    ressourceController.create(request, response, next, Role);
}

roleController.editRole = async(request, response, next) => {
        console.log('enter roleController.editRole');
        ressourceController.update((request, response, next, Role);
        }

        roleController.deleteRole = async(request, response, next) => {
            console.log('enter roleController.deleteRole');
            ressourceController.destroy(request, response, next, Role);
        }

        module.exports = roleController;