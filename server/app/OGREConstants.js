// Base calcul conso carburant par passager (Boeing 747-400) pour 1 A/R
const planeConstants = {
    CONSUMPTION_1_RIDE : 24000,
    DISTANCE_1_RIDE : 14200,
    PASSENGERS_BY_PLANE : 416,
    CALORIFIC_VALUE : 10,
    CONSUMPTION_BY_PASSENGER : (this.CONSUMPTION_1_RIDE * this.CALORIFIC_VALUE / this.PASSENGERS_BY_PLANE) * 2
}

const OGREConstants = {
    CONSUMPTION100KM: 7,
    CALORIFIC_VALUE: 10,
    MOTOR_TYPE: {
        DIESEL: 'Diesel',
        ELECTRIQUE: 'Electrique',
        HYBRIDE: 'Hybride'
    },
    planeConstants : planeConstants,
    daysPerYear : 365
}


// const CarConstants = {
//     CONSUMPTION100KM: 7,
//     CALORIFIC_VALUE: 10,
//     MOTOR_TYPE: {
//         DIESEL: 'Diesel',
//         ELECTRIQUE: 'Electrique',
//         HYBRIDE: 'Hybride'
//     }
// }

module.exports = OGREConstants