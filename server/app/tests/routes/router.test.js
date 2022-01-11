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