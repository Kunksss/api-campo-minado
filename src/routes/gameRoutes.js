const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/start', gameController.start);
router.post('/:gameId/reveal', gameController.reveal);
router.post('/:gameId/cashout', gameController.cashout);

module.exports = router;