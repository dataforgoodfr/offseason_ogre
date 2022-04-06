const globalConstants = {
    populationFrance : 64810000,
    areaFrance : 551695,
    daysPerYear : 365
}

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

const windTurbineOnshoreConstants = {
    loadFactor : 0.33,
    CO2EmissionsPerkWh : 10,
    averageLCOE : 0.0605,
    powerPerM2 : 2
}

const OGREConstants = {
    globalConstants : globalConstants,
    planeConstants : planeConstants,
    carConstants : carConstants,
    windTurbineOnshoreConstants : windTurbineOnshoreConstants
}

module.exports = OGREConstants
