const PersonaOgre = require('../models/PersonaOgre');
const db = require('../config/database');

const playerMapper = {};

// get all players in DB
playerMapper.findAll = async() => {  
    console.log('enter playerMapper.findAll');
    const query = `SELECT * FROM player`
    try {
        const result = await db.query(query);
        // et les retourne, sous forme d'instances de PersonaOgre
        return result.rows.map(player => new PersonaOgre(player));
    } catch(error){
        console.log('dataMapper error raised');
        throw new Error(error);
    }
}

module.exports = playerMapper;