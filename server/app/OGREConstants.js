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

const carConstants = {
    calorificValue: 10
}

const OGREConstants = {
    planeConstants : planeConstants,
    carConstants : carConstants,
    daysPerYear : 365
}
module.exports = OGREConstants
