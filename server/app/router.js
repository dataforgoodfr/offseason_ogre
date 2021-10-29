const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello world');
})

// ici, une 404 pour l'API
router.use((_, response) => {
    response.status(404).json('404 error : endpoint not found');
});

module.exports = router;