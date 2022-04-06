const router = require('../../../app/router');
const playerController = require('../../../app/controllers/playerController');
const request = require('supertest');

app = require('../../../index');

// https://stackoverflow.com/questions/55463886/unit-testing-controllers-use-jest-nodejs/57081471

describe("Test Routes", () => {

    it("Should compute in case: GET /", async() => {
        const result = await request(app).get("/");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /players", async() => {
        const result = await request(app).get("/players");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /Test", async() => {
        const result = await request(app).get("/Test");
        expect(result.status).toEqual(404);
    });

});

describe("Test player Routes", () => {

    it("Should compute in case: Show all players", async() => {
        const result = await request(app).get("/players");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Show one player", async() => {
        const result = await request(app).get("/players/1");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Create one player", async() => {
        playerData = {
            adults_per_household: 2,
            children_per_household: 3,
            car_consumption_id: 1,
            plane_consumption_id: 1,
            created_at: Date.now(),
            updated_at: Date.now()
        }

        const result = await request(app).put("/players").send(playerData);
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(201);
    });

    it("Should compute in case: Update one player", async() => {
        playerData = {
            id: 2,
            adults_per_household: 1,
            children_per_household: 2,
            car_consumption_id: 1,
            plane_consumption_id: 1,
            created_at: Date.now(),
            updated_at: Date.now()
        }

        const result = await request(app).post("/players/2").send(playerData);
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Delete one player", async() => {
        const result = await request(app).delete("/players/2");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(204);
    });
});

describe("Test carConsumption Routes", () => {

    it("Should compute in case: Show all carconsumptions", async() => {
        const result = await request(app).get("/carconsumptions");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Show one carConsumption", async() => {
        const result = await request(app).get("/carconsumptions/1");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Create one carConsumption", async() => {
        carConsumptionData = {
            has_car: true,
            car_share_distance: 2000,
            alone_distance: 5000,
            with_household_distance: 2000,
            litres_per100km: 10,
            created_at: Date.now(),
            updated_at: Date.now()
        }

        const result = await request(app).put("/carconsumptions").send(carConsumptionData);
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(201);
    });

    it("Should compute in case: Update one carConsumption", async() => {
        carConsumptionData = {
            has_car: true,
            car_share_distance: 2000,
            alone_distance: 5000,
            with_household_distance: 2000,
            litres_per100km: 10,
            created_at: Date.now(),
            updated_at: Date.now()
        }

        const result = await request(app).post("/carconsumptions/2").send(carConsumptionData);
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Delete one carConsumption", async() => {
        const result = await request(app).delete("/carconsumptions/2");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(204);
    });
});

describe("Test planeConsumption Routes", () => {

    it("Should compute in case: Show all planeconsumptions", async() => {
        const result = await request(app).get("/planeconsumptions");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Show one planeConsumption", async() => {
        const result = await request(app).get("/planeconsumptions/1");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Create one planeConsumption", async() => {
        planeConsumptionData = {
            distance_per_year: 2000,
            created_at: Date.now(),
            updated_at: Date.now()
        }

        const result = await request(app).put("/planeconsumptions").send(planeConsumptionData);
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(201);
    });

    it("Should compute in case: Update one planeConsumption", async() => {
        planeConsumptionData = {
            distance_per_year: 2000,
            created_at: Date.now(),
            updated_at: Date.now()
        }

        const result = await request(app).post("/planeconsumptions/2").send(planeConsumptionData);
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(200);
    });

    it("Should compute in case: Delete one planeConsumption", async() => {
        const result = await request(app).delete("/planeconsumptions/2");
        expect(result.status).toEqual(200);
        expect(result.body.status).toEqual(204);
    });
});