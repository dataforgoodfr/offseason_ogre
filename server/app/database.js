
const { Pool } = require('pg');

// db est un pool de connecteurs de base de données
const db = new Pool(
// {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {rejectUnauthorized: false}
// }
);
// maintenant, on n'a plus un seul connecteur mais un pool de connecteurs
module.exports = db;