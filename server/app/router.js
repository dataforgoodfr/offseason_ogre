const { Router } = require('express');
const mocked_players = require('./mocked_players')
const router = Router();
const playerController = require('./controllers/playerController');

// dev test
const test = mocked_players.player1.carConfig.consumption()
router.get('/consumption', (req, res) => {
    res.send(String(test));
})

router.get('/', (req, res) => {
    res.send('Hello world');
})

router.get('/players', playerController.allPlayers);

// par défaut si aucune route ne correspond, renvoie une erreur 404 à l'utilisateur
router.use((_, response) => {
    response.status(404).json('404 error : endpoint not found');
});

module.exports = router;