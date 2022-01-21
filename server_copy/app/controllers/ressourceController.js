const ressourceController = {}

ressourceController.index = async(_, response, next, Model) => {
    try {
        const ressource = await Model.findAll();
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.show = async(request, response, next, Model) => {
    try {
        const ressource = await Model.findByPk(request.params.id);
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.create = async(request, response, next, Model) => {
    try {

        console.log('request.body', request.body);
        const ressource = await Model.create(request.body);
        response.json(ressource);
    } catch (error) {
        throw new Error(error);
    }
}

ressourceController.update( = async(request, response, next, Model) => {
            try {
                const ressource = await Model.update(request.body, { where: { id: request.params.id } })
                response.json(ressource);
            } catch (error) {
                throw new Error(error);
            }
        }

        ressourceController.destroy = async(request, response, next, Model) => {
            try {
                const ressource = await Model.destroy({ where: { id: request.params.id } });
                response.json(ressource);
            } catch (error) {
                throw new Error(error);
            }
        }

        module.exports = ressourceController;