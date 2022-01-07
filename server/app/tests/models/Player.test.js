const assert = require("assert").strict;
const Player = require('../../db/models/Player')

describe("test nb of persons per house for a Player ", () => {
    it('Should compute in case: 2 adults and 3 childrens', async() => {
        const player = await Player.findByPk(1)
        assert.equal(player.personsPerHousehold, player.adultsPerHousehold + player.childrenPerHousehold)
    });
});