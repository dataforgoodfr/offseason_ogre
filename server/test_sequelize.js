require('dotenv').config({ path: __dirname + '/.env'});
const sequelize = require('./app/config/databasebis');

testseq = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testseq();

const CarConsumption = require('./app/models/CarConsumption');
const car1 = CarConsumption.build({
    hasCar:true,
    carShareDistance: 1000,
    aloneDistance: 5000,
    withHouseholdDistance: 2000,
    litresPer100km:10
});
// console.log(car1);
console.log('personsPerHousehold',car1.personsPerHousehold);
console.log('dailyAloneDistance',car1.dailyAloneDistance);
console.log('dailyWithHouseholdDistance',car1.dailyWithHouseholdDistance);
console.log('distancePerLiter',car1.distancePerLiter);
console.log('aloneConsumption',car1.aloneConsumption);
console.log('withHouseholdConsumption',car1.withHouseholdConsumption);
console.log('carShareConsumption',car1.carShareConsumption);
console.log('carConsumption',car1.carConsumption);