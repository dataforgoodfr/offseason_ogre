const { Sequelize } = require('sequelize');
if (process.env.DB_ENABLE_SSL != 'false') {
    dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    }
} else {
    dialectOptions = {};
}

const sequelize = new Sequelize(
    process.env.DATABASE_URL, {
    // `${process.env.DATABASE_URL}?sslmode=require`
    define: {
        underscored: true, //camelCase fields in javascript are translated to snace_case fields in database tables
    },
    dialectOptions
}
);

module.exports = sequelize;
