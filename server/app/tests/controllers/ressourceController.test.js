const { mockRequest, mockResponse } = require('../../../app/utils/interceptor')
const ressourceController = require('../../../app/controllers/ressourceController');
const { Player, CarConsumption, PlaneConsumption } = require('../../../app/db/models');
const { getMockReq, getMockRes } = require('@jest-mock/express');
const req = getMockReq({
    headers: {
        'user-agent': 'Chrome',
    },
    path: '/path',
})

const { res, next, clearMockRes } = getMockRes({})

describe("Test ressourceController Throw", () => {

    it("Should compute in case: index Throw error", async() => {
        await expect(ressourceController.index(req, res, next, Player)).resolves.not.toThrow();
    });

    it("Should compute in case: index Throw error", async() => {
        await expect(ressourceController.index(req, res, next, [Player])).rejects.toThrow();
    });

    it("Should compute in case: show Throw error", async() => {
        await expect(ressourceController.show(req, res, next, [Player])).rejects.toThrow();
    });

    it("Should compute in case: create Trow error", async() => {
        await expect(ressourceController.create(req, res, next, [Player])).rejects.toThrow();
    });

    it("Should compute in case: GET /", async() => {
        await expect(ressourceController.update(req, res, next, [Player])).rejects.toThrow();
    });

    it("Should compute in case: GET /", async() => {
        await expect(ressourceController.destroy(req, res, next, [Player])).rejects.toThrow();
    });
});

describe("Test ressourceController responses", () => {

    it("Should compute in case: index Throw error", async() => {
        //         // .expect('Content-Type', /json/)
        //         // //     // .expect('Content-Length', '15')
        //         // .expect(200)
        //         // .end
        //         // let req = mockRequest();
        //         // req.params.id = 1;
        //         // const res = mockResponse();
        //         result = await ressourceController.index(req, res, next, Player)
        //         test = result.status.mockReturnThis({ status: 200, data: 'result' });
        //         // // response = await controller.todoController(req, res);
        //         // response = await ressourceController.index(req, res, next, Player) //.resolves).toBe(200);
        //         res.send();
        //         // test.send();
        //         ressources = await Player.findAll();
        //         console.log('response', ressources);
        //         expect(res.send).toHaveBeenCalledTimes(1);
        // var test = ressourceController.index(req, res, next, Player)
        console.log('=>>>>>>>>>>>>>>>>>>>>>>> Ressource controller ' + ressourceController.index(req, res, next, Player));
    });

    //     it("Should compute in case: index Throw error", async() => {
    //         await expect(ressourceController.index(req, res, next, [Player])).rejects.toThrow();
});

//     it("Should compute in case: show Throw error", async() => {
//         await expect(ressourceController.show(req, res, next, [Player])).rejects.toThrow();
//     });

//     it("Should compute in case: create Trow error", async() => {
//         await expect(ressourceController.create(req, res, next, [Player])).rejects.toThrow();
//     });

//     it("Should compute in case: GET /", async() => {
//         await expect(ressourceController.update(req, res, next, [Player])).rejects.toThrow();
//     });

//     it("Should compute in case: GET /", async() => {
//         await expect(ressourceController.destroy(req, res, next, [Player])).rejects.toThrow();
//     });
// });