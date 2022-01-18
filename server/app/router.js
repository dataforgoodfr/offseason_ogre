const { Router } = require('express');
const router = Router();
const ressource = require('./utils/autoresources');

ressource.map(router, 'playerController');
ressource.map(router, 'carConsumptionController');
ressource.map(router, 'planeConsumptionController');

router.get('/', (req, res) => {
    res.send('Hello world');
})

// default: if no other path is corresponding, returns 404 error to user
router.use((_, response) => {
    response.status(404).json('404 error : endpoint not found');
});

module.exports = router;