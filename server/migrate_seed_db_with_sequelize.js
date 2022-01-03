const sequelize = require('./app/config/database');
const { CarConsumption } = require('./app/models');
const { Player } = require('./app/models');
const { PlaneConsumption } = require('./app/models');

//test dataset
playerData = {
    adultsPerHousehold:2,
    childrenPerHousehold:3,
    CarConsumptionId:1,
    PlaneConsumptionId:1
}
carData = {
    hasCar:true,
    carShareDistance: 1000,
    aloneDistance: 5000,
    withHouseholdDistance: 2000,
    litresPer100km:10
}
planeData = {
    distancePerYear:2000
}

module.exports = async () => {
    try {
        await sequelize.authenticate(); //check sequelize connexion with DB
        //tables creation in DB (tables are created from sequelize models). option {force:true} : forces deletion of tables and recreates them  
        await sequelize.sync({ force: true }); //create tables in database (tables are created from models)
        //tables seeding with test dataset
        const car = await CarConsumption.create(carData);
        const plane = await PlaneConsumption.create(planeData);
        const player = await Player.create(playerData);
      } catch (error) {
        console.error('error while tables creation or seeding', error);
    }
}