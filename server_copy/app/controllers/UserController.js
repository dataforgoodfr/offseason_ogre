const User = require('../db/models/User');
const ressourceController = require('./ressourceController');
const userController = {}

userController.index = async(_, response, next) => {
    console.log('enter userController.index');
    ressourceController.index(_, response, next, User);
}

userController.show = async(request, response, next) => {
    console.log('enter userController.show');
    ressourceController.show(request, response, next, User);
}

userController.create = async(request, response, next) => {
    console.log('====================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> enter userController.create');
    ressourceController.create(request, response, next, User);
}

userController.update = async(request, response, next) => {
        console.log('enter userController.update');
        ressourceController.update((request, response, next, User);
        }

        userController.destroy = async(request, response, next) => {
            console.log('enter userController.delete');
            ressourceController.destroy(request, response, next, User);
        }

        module.exports = userController;