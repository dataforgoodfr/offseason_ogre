'use strict';

/* istanbul ignore file */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('car_consumption', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            has_car: Sequelize.BOOLEAN,
            car_share_distance: Sequelize.INTEGER,
            alone_distance: Sequelize.INTEGER,
            with_household_distance: Sequelize.INTEGER,
            litres_per100km: Sequelize.FLOAT,
            motor_type: Sequelize.INTEGER,
            player_id: Sequelize.INTEGER,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
        await queryInterface.createTable('plane_consumption', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            distance_per_year: Sequelize.INTEGER,
            player_id: Sequelize.INTEGER,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
		await queryInterface.createTable('wind_turbine_onshore_production', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            ratio_territory : Sequelize.FLOAT,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
        await queryInterface.createTable('player', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            adults_per_household: Sequelize.INTEGER,
            children_per_household: Sequelize.INTEGER,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('car_consumption');
        await queryInterface.dropTable('plane_consumption');
		await queryInterface.dropTable('wind_turbine_onshore_production');
        await queryInterface.dropTable('player');
        await queryInterface.dropTable('windturbineonshore_production');
    }
};
