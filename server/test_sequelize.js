require('dotenv').config({ path: __dirname + '/.env'});
const sequelize = require('./app/config/databasebis');
const CarConsumption = require('./app/models/CarConsumption');
const Player = require('./app/models/Player');

playerData = {
    adultsPerHousehold:2,
    childrenPerHousehold:3
}
carData = {
    hasCar:true,
    carShareDistance: 1000,
    aloneDistance: 5000,
    withHouseholdDistance: 2000,
    litresPer100km:10
}

test_sequelize = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        const car = await CarConsumption.create(carData);
        const player = await Player.create(playerData);
        
        
        console.log(car.toJSON());
        console.log(player.toJSON());    
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

test_sequelize();