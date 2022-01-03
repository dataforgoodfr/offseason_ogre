
const { Pool } = require('pg');

// db est un pool de connecteurs de base de données
const db = new Pool(
{
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
    // connectionString: process.env.PGUSER,
    // ssl: {rejectUnauthorized: false}
}
);
module.exports = db;