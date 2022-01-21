'use strict';

/* istanbul ignore file */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('role', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: Sequelize.STRING,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('role');
    }
};