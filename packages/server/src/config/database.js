/* sequelize configuration file to connect to DB within the application running */

const { Sequelize } = require("sequelize");
if (process.env.DB_ENABLE_SSL !== "false") {
  dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
} else {
  dialectOptions = {};
}
console.log("is this file called when seeding ?");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    underscored: true, //camelCase fields in javascript are translated to snace_case fields in database tables
  },
  dialectOptions,
});

module.exports = sequelize;
