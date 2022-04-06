/* sequelize configuration file to manage migrations and seeding without running the app */

var path = require('path')
const dotenv = require("dotenv");
dotenv.config(path.resolve('./', '.env'));
console.log(process.env.DATABASE_URL);
module.exports = {
    "development": {
        "url": process.env.DATABASE_URL,
        "dialect": "postgres"
    },
    "staging": {
        "url": `${process.env.DATABASE_URL}?sslmode=require`,
        "dialect": "postgres",
        "dialectOptions": {
            "ssl": {
              "rejectUnauthorized": false
            }
        },
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
