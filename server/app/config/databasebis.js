const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL, {
    define: {
        underscored: true, //camelCase fields in javascript are translated to snace_case fields in database tables

        // EST-CE QUE C'est UTILE ? Afin de modifier le nom de la propriété des champs en sorti de requête sequelize on précise des correspondances
        // createdAt: 'created_at',
        // updatedAt : 'updated_at'
    }
});

module.exports = sequelize;