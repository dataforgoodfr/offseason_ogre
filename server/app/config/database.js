const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        underscored: true, //camelCase fields in javascript are translated to snace_case fields in database tables
    }
});

module.exports = sequelize;
