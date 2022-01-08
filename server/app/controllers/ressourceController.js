const ressourceController = {}

ressourceController.allRessources = async(_, response, next, Model, arrayIncludedModels = []) => {
    try {
        const ressource = arrayIncludedModels != [] ? await Model.findAll({ include: arrayIncludedModels }) : await Model.findAll();
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.getRessource = async(request, response, next, Model) => {
    try {
        const ressource = arrayIncludedModels != [] ? await Model.findByPk(request.params.id, { include: arrayIncludedModels }) : await Model.findByPk({ where: { id: request.params.id } });
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.createRessource = async(request, response, next, Model) => {
    try {

        console.log('request.body', request.body);
        const ressource = await Model.create(request.body);
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.editRessource = async(request, response, next, Model) => {
    try {
        const ressource = await Model.update(request.body, { where: { id: request.params.id } })
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.deleteRessource = async(request, response, next, Model) => {
    try {
        const ressource = await Model.destroy({ where: { id: request.params.id } });
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = ressourceController;