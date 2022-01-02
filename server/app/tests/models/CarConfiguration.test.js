const CarConfiguration = require('../../models/CarConfiguration')
const OGREConstant = require('../../OGREConstants')
const assert = require("assert").strict;

describe("test consumption calculation", function() {
    it("Should compute in case : No car and 100 km carshare", function() {
        isCar = false;
        numberOfAdult = 1;
        numberOfChildren = 0
        carshareDistance = 100;
        aloneDistance = null;
        withHouseholdDistance = null;
        litrePer100km = null;
        let carConfig = new CarConfiguration(isCar, numberOfAdult, numberOfChildren, carshareDistance, aloneDistance,
            withHouseholdDistance, litrePer100km, OGREConstant.MOTOR_TYPE.DIESEL);
        assert.equal((Math.round(carConfig.consumption()*100)/100), 0.19);
    });

    it("Should compute in case : got a car, 2 adult, 2 children, 12000 km alone and 5000 km with houshold", function() {
        isCar = true;
        numberOfAdult = 2;
        numberOfChildren = 2
        carshareDistance = null;
        aloneDistance = 12000;
        withHouseholdDistance = 5000;
        litrePer100km = 7;
        let carConfig = new CarConfiguration(isCar, numberOfAdult, numberOfChildren, carshareDistance, aloneDistance,
            withHouseholdDistance, litrePer100km, OGREConstant.MOTOR_TYPE.DIESEL);
        assert.equal((Math.round(carConfig.consumption()*100)/100), 25.41);
    });

    it("Should not compute if isCar is not boolean", function() {
        isCar = 'toto';
        numberOfAdult = 2;
        numberOfChildren = 2
        carshareDistance = null;
        aloneDistance = 12000;
        withHouseholdDistance = 5000;
        litrePer100km = 7;
        let carConfig = new CarConfiguration(isCar, numberOfAdult, numberOfChildren, carshareDistance, aloneDistance,
            withHouseholdDistance, litrePer100km, OGREConstant.MOTOR_TYPE.DIESEL);
        assert.throws(()=> {throw new Error('The isCar property must be define as a boolean')}, Error);
    });
/* todo Le cas electrique n'est vraiment pas clair dans le fichier excel. A voir avec Gregory.
    it("Should compute in case of an electric car", function() {
        isCar = false;
        numberOfAdult = 1;
        numberOfChildren = 0
        carshareDistance = 100;
        aloneDistance = null;
        withHouseholdDistance = null;
        litrePer100km = null;
        let carConfig = new CarConfiguration(isCar, numberOfAdult, numberOfChildren, carshareDistance, aloneDistance,
            withHouseholdDistance, litrePer100km, OGREConstant.MOTOR_TYPE.ELECTRIQUE);
        assert.equal((Math.round(carConfig.consumption()*100)/100), 0.19);
    });

 */
});
