/* istanbul ignore file */

var path = require('path')
const dotenv = require("dotenv");
dotenv.config(path.resolve('./', '.env'));

module.exports = {
    "development": {
        "url": process.env.DATABASE_URL,
        "dialect": "postgres"
    },
    "staging": {
        "url": process.env.DATABASE_URL,
        "dialect": "postgres",
        "ssl": true,
    },
    "test": {
        "url": process.env.PG_URL_TEST,
        "dialect": "postgres"
    },
    "production": {
        "url": process.env.PG_URL_PRODUCTION,
        "dialect": "postgres"
    }
}
