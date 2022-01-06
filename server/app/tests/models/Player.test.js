const {mock} = require("sinon");
const assert = require("assert").strict;
const {playerModel} = require("../../models/Player");
const {Player} = require("../../models");

let mockedFn = jest.FnInstance;

jest.mock("../../models/Player");

const mocked_player = jest.MockedFunction(Player);

describe("test consumption calculation", () => {
    beforeEach(() => {

        jest.resetModules();
//        mockedFn = jest.fn();
    });

  //  afterEach(() => {
        // Reset to the original method implementation (non-mocked) and clear all the mock data
    //    mockedFn.mockRestore();
    //});
    const getNow = () => new Date(Date.now());
    it('does third thing', () => {
        //player = mockedFn.mockImplementationOnce({id: 1})
        player = jest
            .spyOn(playerModel, 'findByPk')
            .mockReturnValueOnce(() =>
                Promise.resolve({id: 1, name: "test", consumption: 0, lastConsumption: getNow()})
            );

        test = jest.doMock('../../models/Player', () => ({
            findByPk: jest.fn(() => {
                return Promise.resolve({id: 1, name: "test", consumption: 0, lastConsumption: getNow()})
            })
        }));

        console.log(test);
        /* Another test with the default mock implementation */
    });
});