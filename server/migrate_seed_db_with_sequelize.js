const sequelize = require('./app/config/database');
const { CarConsumption } = require('./app/models');
const { Player } = require('./app/models');

//test dataset
playerData = {
    adultsPerHousehold:2,
    childrenPerHousehold:3,
    CarConsumptionId:1
}
carData = {
    hasCar:true,
    carShareDistance: 1000,
    aloneDistance: 5000,
    withHouseholdDistance: 2000,
    litresPer100km:10
}

carDataWithNoPersonalCar = {
    hasCar:false,
    carShareDistance: 1000,
    aloneDistance: 0,
    withHouseholdDistance: 2000,
    litresPer100km:10
}

module.exports = async () => {
    try {
        await sequelize.authenticate(); //check sequelize connexion with DB
        await sequelize.sync({ force: true }); //create tables in database (tables are created from models)
        const car = await CarConsumption.create(carData); //add new carCons in DB
        await CarConsumption.create(carDataWithNoPersonalCar); //add new carCons in DB
        const player = await Player.create(playerData); //add new player in DB
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}