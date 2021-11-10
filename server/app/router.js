const { Router } = require('express');
const router = Router();
const playerController = require('./controllers/playerController');

router.get('/', (_, res) => {
    res.send('Hello world');
})

router.get('/players', playerController.allPlayers);

// par défaut si aucune route ne correspond, renvoie une erreur 404 à l'utilisateur
router.use((_, response) => {
    response.status(404).json('404 error : endpoint not found');
});

module.exports = router;