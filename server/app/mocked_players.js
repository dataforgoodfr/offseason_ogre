const PersonaOgre = require('./models/PersonaOgre')
const CarConfiguration = require('./models/CarConfiguration')
const OGREConstant = require('./OGREConstants')

// first mock
isCar = false;
numberOfAdult = 1;
numberOfChildren = 0
carshareDistance = 100;
aloneDistance = null;
withHouseholdDistance = null;
literPer100km = 7;
motorType = OGREConstant.MOTOR_TYPE.DIESEL;

let carConfig1 = new CarConfiguration(isCar, numberOfAdult, numberOfChildren, carshareDistance, aloneDistance,
    withHouseholdDistance, literPer100km, motorType);
player1 = new PersonaOgre({name : 'Camus', team: 'Equipe1', carConfig : carConfig1})

// second mock
isCar = true;
numberOfAdult = 2;
numberOfChildren = 2
carshareDistance = null;
aloneDistance = 12000;
withHouseholdDistance = 5000;
literPer100km = 7;
motorType = OGREConstant.MOTOR_TYPE.DIESEL;


let carConfig2 = new CarConfiguration(isCar, numberOfAdult, numberOfChildren, carshareDistance, aloneDistance,
    withHouseholdDistance, literPer100km, motorType);
player2 = new PersonaOgre({name : 'Proust', team : 'Equipe2', carConfig : carConfig2})


const players = {
    player1,
    player2
}
module.exports = players;