const db = require('../config/database');

const PersonaOgre = class {
    constructor(obj) {
        this.name = obj.name;
        this.team = obj.team;
        this.carConfig = obj.carConfig;
    }

    static async findAll() {
        const query = `SELECT * FROM player;`;
        try {
            const result = await db.query(query);
            let players = [];
            for (const row of result.rows) {
                // on transforme la donnée brute de la query sql en instance de PersonaOgre
                const player = new PersonaOgre(row);
                players.push(player);
            }
            return players;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = PersonaOgre;