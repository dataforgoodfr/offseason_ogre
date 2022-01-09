const router = require('../../../app/router');
// const playerController = require('../../../app/controllers/playerController');
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