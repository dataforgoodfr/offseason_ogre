const playerMapper = require('../dataMappers/playerMapper');
const PersonaOgre = require('../models/PersonaOgre');

const playerController = {}

// Soit on intègre les requêtes à la BDD directement dans la classe avec des méthodes dédiées, 
//soit on répertorie toutes les interactions en lien avec la BDD dans un dossier "dataMappers" à part

playerController.allPlayers = async (_, response, next) => {
    console.log('enter playerController.allPlayers');
    try {
        const players = await playerMapper.findAll();
        response.json(players);
    } catch(error) {
        throw new Error(error);
    }
}

playerController.allPlayersBis = async (_, response, next) => {
    console.log('enter playerController.allPlayersBis');
    try {
        const players = await PersonaOgre.findAll();
        response.json(players);
    } catch(error) {
        throw new Error(error);
    }
}

module.exports = playerController;