const assert = require("assert").strict;
const CarConsumption = require('../../db/models/CarConsumption')
const OGREConstants = require("../../OGREConstants");
const Player = require("../../db/models/Player");

describe("test CarConsumption ", () => {
    it('Should compute in case: check dailyAloneDistance', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        assert.equal(carConsumption.dailyAloneDistance, carConsumption.aloneDistance / 365)
    });

    it('Should compute in case: check dailyWithHouseholdDistance', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        assert.equal(carConsumption.dailyWithHouseholdDistance, carConsumption.withHouseholdDistance / 365)
    });

    it('Should compute in case: check distancePerLiter', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        assert.equal(carConsumption.distancePerLiter, 100 / carConsumption.litresPer100km)
    });

    it('Should compute in case: check aloneConsumption', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        assert.equal(carConsumption.aloneConsumption, carConsumption.dailyAloneDistance * OGREConstants.calorificValue / carConsumption.distancePerLiter)
    });

    it('Should compute in case: check withHouseholdConsumption', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        assert.equal(carConsumption.withHouseholdConsumption, carConsumption.dailyWithHouseholdDistance * OGREConstants.calorificValue / carConsumption.distancePerLiter / carConsumption.personsPerHousehold)
    });

    it('Should compute in case: check dailycarShareDistance', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        assert.equal(carConsumption.dailycarShareDistance, carConsumption.carShareDistance / 365)
    });

    it('Should compute in case: check carShareConsumption', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        expect(carConsumption.carShareConsumption).toBeCloseTo((carConsumption.dailycarShareDistance * OGREConstants.calorificValue / carConsumption.distancePerLiter), 15);
    });

    it('Should compute in case: check carConsumption if has car', async() => {
        const carConsumption = await CarConsumption.findByPk(1)
        assert.equal(carConsumption.hasCar, true)
        assert.equal(carConsumption.withHouseholdConsumption + carConsumption.aloneConsumption, carConsumption.carConsumption)
    });

    it('Should compute in case: check carConsumption if has no car', async() => {
        const carConsumption = await CarConsumption.findByPk(2)
        assert.equal(carConsumption.hasCar, false)
        assert.equal(carConsumption.carConsumption, carConsumption.carShareConsumption)
    });
});
