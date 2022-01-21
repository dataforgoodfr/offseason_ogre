'use strict';

/* istanbul ignore file */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('facilitator', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER,
            },
            session_id: {
                type: Sequelize.INTEGER,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('facilitator');
    }
};