// Base calcul conso carburant par passager (Boeing 747-400) pour 1 A/R
const planeConstants = {
    consumptionOneRide : 24000,
    distanceOneRide : 14200,
    passengersByPlane : 416,
    calorificValue : 10,
    get consumptionByPassenger() {
        return (this.consumptionOneRide * this.calorificValue / this.passengersByPlane) * 2
    }
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
module.exports = OGREConstants