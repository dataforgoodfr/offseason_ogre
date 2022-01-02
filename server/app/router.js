const { Router } = require('express');
const router = Router();
const playerController = require('./controllers/playerController');

router.get('/players', playerController.allPlayers);

router.get('/', (req, res) => {
    res.send('Hello world');
})

// par défaut si aucune route ne correspond, renvoie une erreur 404 à l'utilisateur
router.use((_, response) => {
    response.status(404).json('404 error : endpoint not found');
});

module.exports = router;