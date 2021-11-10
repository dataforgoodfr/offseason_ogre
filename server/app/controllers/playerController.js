// const { response } = require('express');
// const playerMapper = require('../dataMappers/playerMapper');
// const Player = require('../models/player');

const playerController = {}

playerController.allPlayers = async (request, response, next) => {
    console.log('enter playerController.allPlayers');
    // try {
    //     // const players = await playerMapper.findAll();
    //     const players = [
    //         {id: 1, name:'Maeva'},
    //         {id: 2, name:'Luc'},
    //         {id: 3, name:'Sarah'},
    //     ]
    //     response.json(players);
    // } catch(error) {
    //     next(error);
    // }

    const db = require('../database');
    try {
        const result = await db.query('SELECT * FROM player;');
        response.json(result.rows);
    } catch(error) {
        throw new Error(error);
    }
}

module.exports = playerController;