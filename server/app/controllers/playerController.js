const { Player, PlaneConsumption } = require('../db/models');
const { CarConsumption } = require('../db/models');
const playerController = {}

playerController.allPlayers = async(_, response, next) => {
    console.log('enter playerController.allPlayers');
    try {
        const players = await Player.findAll({
            include: [CarConsumption, PlaneConsumption]
        });
        response.json(players);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = playerController;