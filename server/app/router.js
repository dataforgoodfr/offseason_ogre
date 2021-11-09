const { Router } = require('express');
const mocked_players = require('./mocked_players')
const router = Router();

// dev test
const test = mocked_players.player1.carConfig.consumption()
router.get('/consumption', (req, res) => {
    res.send(String(test));
})

router.get('/', (req, res) => {
    res.send('Hello world');
})

// ici, une 404 pour l'API
router.use((_, response) => {
    response.status(404).json('404 error : endpoint not found');
});

module.exports = router;