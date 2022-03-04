const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(`${process.env.DATABASE_URL}?sslmode=require`, {
    // `${process.env.DATABASE_URL}?sslmode=require`
    define: {
        underscored: true, //camelCase fields in javascript are translated to snace_case fields in database tables
    },
    // ssl:true,
    // native: true,
    dialectOptions: {
        ssl: true,
        // ssl: {
        //   //require: true,
        //   rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        // }
    },
});

module.exports = sequelize;
