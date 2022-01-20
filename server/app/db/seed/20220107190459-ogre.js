/* istanbul ignore file */

'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('player', [{
            adults_per_household: 2,
            children_per_household: 3,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('player', [{
            adults_per_household: 1,
            children_per_household: 2,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('car_consumption', [{
            has_car: true,
            car_share_distance: 1000,
            alone_distance: 5000,
            with_household_distance: 2000,
            litres_per100km: 10,
            player_id: 1,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('car_consumption', [{
            has_car: false,
            car_share_distance: 1000,
            alone_distance: 0,
            with_household_distance: 0,
            litres_per100km: 10,
            player_id: 2,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('plane_consumption', [{
            distance_per_year: 2000,
            player_id: 1,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('plane_consumption', [{
            distance_per_year: 500,
            player_id: 2,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('car_consumption', null, {});
        await queryInterface.bulkDelete('plane_consumption', null, {});
        await queryInterface.bulkDelete('player', null, {});
    }
};
