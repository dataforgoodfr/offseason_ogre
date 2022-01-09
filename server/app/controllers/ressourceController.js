const ressourceController = {}

ressourceController.index = async(_, response, next, Model, arrayIncludedModels = []) => {
    try {
        const ressources = arrayIncludedModels != [] ? await Model.findAll({ include: arrayIncludedModels }) : await Model.findAll();
        ressources ? response.json({ status: 200, data: ressources }) : response.json({ status: 404, data: 'data not found' });
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.show = async(request, response, next, Model, arrayIncludedModels = []) => {
    try {
        const ressource = arrayIncludedModels != [] ? await Model.findByPk(request.params.id, { include: arrayIncludedModels }) : await Model.findByPk({ where: { id: request.params.id } });
        ressource ? response.json({ status: 200, data: ressource }) : response.json({ status: 404, data: 'data not found' });
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.create = async(request, response, next, Model) => {
    try {

        console.log('request.body', request.body);
        const ressource = await Model.create(request.body);
        ressource ? response.json({ status: 201, data: ressource }) : response.json({ status: 404, data: 'data not found' });
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.update = async(request, response, next, Model) => {
    try {
        const ressource = await Model.update(request.body, { where: { id: request.params.id } })
        ressource ? response.json({ status: 200, data: ressource }) : response.json({ status: 404, data: 'data not found' });
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.destroy = async(request, response, next, Model) => {
    try {
        const ressource = await Model.destroy({ where: { id: request.params.id } });
        ressource ? response.json({ status: 204, data: ressource }) : response.json({ status: 404, data: 'data not found' });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = ressourceController;