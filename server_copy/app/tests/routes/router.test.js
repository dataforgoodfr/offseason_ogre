const router = require('../../../app/router');
const playerController = require('../../../app/controllers/playerController');
const request = require('supertest');

app = require('../../../index');

// https://stackoverflow.com/questions/55463886/unit-testing-controllers-use-jest-nodejs/57081471

describe("Test main Routes", () => {

    it("Should compute in case: GET /", async() => {
        const result = await request(app).get("/");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /Test", async() => {
        const result = await request(app).get("/Test");
        expect(result.status).toEqual(404);
    });
});

describe("Test Player Routes", () => {
    it("Should compute in case: GET /players", async() => {
        const result = await request(app).get("/players");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /players/:id", async() => {
        const result = await request(app).get("/players/1");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: PUT /players/", async() => {
        const result = await request(app).put("/players/");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: POST /players/:id", async() => {
        const result = await request(app).post("/players/2");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: DELETE /players/:id", async() => {
        const result = await request(app).delete("/players/2");
        expect(result.status).toEqual(200);
    });
});

describe("Test Session Routes", () => {
    it("Should compute in case: GET /sessions/", async() => {
        const result = await request(app).get("/sessions");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /sessions/:id", async() => {
        const result = await request(app).get("/sessions/1");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: PUT /sessions/", async() => {
        const result = await request(app).put("/sessions/");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: POST /sessions/:id", async() => {
        const result = await request(app).post("/sessions/2");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: DELETE /sessions/:id", async() => {
        const result = await request(app).delete("/sessions/2");
        expect(result.status).toEqual(200);
    });
});

describe("Test Team Routes", () => {
    it("Should compute in case: GET /teams", async() => {
        const result = await request(app).get("/teams");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /teams/:id", async() => {
        const result = await request(app).get("/teams/1");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: PUT /teams/", async() => {
        teamData = {
            name: "Ma super session",
            session_id: 1
        };

        const result = await request(app).put("/teams/").send(teamData);
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: POST /teams/:id", async() => {
        const result = await request(app).post("/teams/2");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: DELETE /teams/:id", async() => {
        const result = await request(app).delete("/teams/2");
        expect(result.status).toEqual(200);
    });
});
describe("Test User Routes", () => {
    it("Should compute in case: GET /users", async() => {
        const result = await request(app).get("/users");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /users/:id", async() => {
        const result = await request(app).get("/users/1");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: PUT /users/", async() => {
        userData = {
            first_name: "Rémi",
            last_name: "Boucher",
            username: "remi",
            email: "remi.boucher@outlook.com",
            password: "azerty",
            role_id: 1
        };

        const result = await request(app).put("/users/").send(userData);
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: POST /users/:id", async() => {
        userData = {
            first_name: "Laura",
            last_name: "Boucher",
            username: "remi",
            email: "laura.boucher@outlook.com",
            password: "azerty",
            role_id: 1
        };
        const result = await request(app).post("/users/2").send(userData);
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: DELETE /users/:id", async() => {
        const result = await request(app).delete("/users/1");
        expect(result.status).toEqual(200);
    });
});

describe("Test facilitator Routes", () => {
    it("Should compute in case: GET /facilitators", async() => {
        const result = await request(app).get("/facilitators");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: GET /facilitators/:id", async() => {
        const result = await request(app).get("/facilitators/1");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: PUT /facilitators/", async() => {
        const result = await request(app).put("/facilitators/");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: POST /facilitators/:id", async() => {
        const result = await request(app).post("/facilitators/2");
        expect(result.status).toEqual(200);
    });

    it("Should compute in case: DELETE /facilitators/:id", async() => {
        const result = await request(app).delete("/facilitators/2");
        expect(result.status).toEqual(200);
    });
});

describe("Test roles Routes", () => {
    it.skip("Should compute in case: GET all roles", async() => {
        const result = await request(app).get("/roles");
        expect(result.status).toEqual(200);
    });

    it.skip("Should compute in case: GET one role", async() => {
        const result = await request(app).get("/roles/1");
        expect(result.status).toEqual(200);
    });

    it.skip("Should compute in case: PUT  a new role", async() => {
        const result = await request(app).put("/roles/");
        expect(result.status).toEqual(200);
    });

    it.skip("Should compute in case: POST a role", async() => {
        const result = await request(app).post("/roles/2");
        expect(result.status).toEqual(200);
    });

    it.skip("Should compute in case: DELETE delete a role", async() => {
        const result = await request(app).delete("/roles/2");
        expect(result.status).toEqual(200);
    });
});