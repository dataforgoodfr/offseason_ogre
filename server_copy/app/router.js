const { Router } = require('express');
const router = Router();
const playerController = require('./controllers/playerController');
const sessionController = require('./controllers/SessionController');
const teamController = require('./controllers/TeamController');
const facilitatorController = require('./controllers/FacilitatorController');
const userController = require('./controllers/UserController');
const resources = require('./utils/autoresources.js')

router.get('/players', playerController.allPlayers);
router.get('/players/:id', playerController.getPlayer);
router.put('/players/', playerController.createPlayer);
router.post('/players/:id', playerController.editPlayer);
router.delete('/players/:id', playerController.deletePlayer);

resources.map(router, 'SessionController');
resources.map(router, 'TeamController');
resources.map(router, 'UserController')

router.get('/facilitators', facilitatorController.allFacilitators);
router.get('/facilitators/:id', facilitatorController.getFacilitator);
router.put('/facilitators/', facilitatorController.createFacilitator);
router.post('/facilitators/:id', facilitatorController.editFacilitator);
router.delete('/facilitators/:id', facilitatorController.deleteFacilitator);

router.get('/', (req, res) => {
    res.send('Hello world');
})

// default: if no other path is corresponding, returns 404 error to user
router.use((_, response) => {
    response.status(404).json('404 error : endpoint not found');
});

module.exports = router;