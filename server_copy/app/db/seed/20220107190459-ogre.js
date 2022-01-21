/* istanbul ignore file */

'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('car_consumption', [{
            has_car: true,
            car_share_distance: 1000,
            alone_distance: 5000,
            with_household_distance: 2000,
            litres_per100km: 10,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('car_consumption', [{
            has_car: false,
            car_share_distance: 1000,
            alone_distance: 0,
            with_household_distance: 2000,
            litres_per100km: 10,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('plane_consumption', [{
            distance_per_year: 2000,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('player', [{
            adults_per_household: 2,
            children_per_household: 3,
            car_consumption_id: 1,
            plane_consumption_id: 1,
            user_id: 1,
            team_id: 1,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('session', [{
            name: 'Super session',
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('team', [{
            name: 'Super team',
            session_id: 1,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('facilitator', [{
            user_id: 1,
            session_id: 1,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('users', [{
            id: 1,
            first_name: 'Rémi',
            last_name: 'Boucher',
            username: 'remi',
            email: 'remi.boucher@outlook.com',
            password: 'Test1234',
            role_id: 1,
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});

        await queryInterface.bulkInsert('role', [{
            id: 1,
            name: 'admin',
            created_at: Sequelize.fn('NOW'),
            updated_at: Sequelize.fn('NOW')
        }], {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('car_consumption', null, {});
        await queryInterface.bulkDelete('plane_consumption', null, {});
        await queryInterface.bulkDelete('player', null, {});
        await queryInterface.bulkDelete('session', null, {});
        await queryInterface.bulkDelete('team', null, {});
        await queryInterface.bulkDelete('facilitator', null, {});
        await queryInterface.bulkDelete('users', null, {});
        await queryInterface.bulkDelete('role', null, {});
    }
};