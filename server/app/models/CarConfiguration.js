const OGREConstants = require("../OGREConstants");
const CarConfiguration = class {
    constructor(isCar,
                numberOfAdult,
                numberOfChildren,
                carshareDistance,
                aloneDistance,
                withHouseholdDistance,
                litrePer100km,
                motorType) {
        this.isCar = isCar;
        this.numberOfAdult = numberOfAdult;
        this.numberOfChildren = numberOfChildren
        this.carshareDistance = carshareDistance;
        this.aloneDistance = aloneDistance;
        this.withHouseholdDistance = withHouseholdDistance;
        this.litrePer100km = litrePer100km;
        this.motorType = motorType;
    }

    // Compute consumption for this CarConfiguration
    consumption() {

        if (this.isCar === false) {

            let daily_distance = this.carshareDistance / 365
            let distance_per_liter = 100/OGREConstants.CONSUMPTION100KM

            return (daily_distance / distance_per_liter) * OGREConstants.CALORIFIC_VALUE

        } else if (this.isCar === true) {

            // Alone part
            let daily_distance_alone = this.aloneDistance / 365
            let daily_distance_with_household = this.withHouseholdDistance /365
            let distance_per_liter = 100/this.litrePer100km
            let consumption_alone = (daily_distance_alone/distance_per_liter)*OGREConstants.CALORIFIC_VALUE

            // With household part
            let number_of_people_in_household = this.numberOfAdult + this.numberOfChildren
            let consumption_with_household =
                (daily_distance_with_household/distance_per_liter)*OGREConstants.CALORIFIC_VALUE
                / number_of_people_in_household

            return (consumption_alone + consumption_with_household)
        } else {
            throw new Error('The isCar property must be define as a boolean')
        }
    }
}
module.exports = CarConfiguration