// const Player = require('../models/player');
const db = require('../database');

const animalMapper = {};

// get all players in DB
playerMapper.findAll = async() => {  
    const query = `SELECT * FROM player`
    try {
        const result = await db.query(query);
        // et les retourne, sous forme d'instances de Player
        // return result.rows.map(player => new Player(player));
        return result.rows;
    } catch(error){
        console.log('dataMapper error raised');
        throw new Error(error);
    }
}
