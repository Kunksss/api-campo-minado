const gameService = require('../services/gameService');

const start = async (req, res) => {
    try {
        const { idUser, valorAposta } = req.body;
        const gameId = await gameService.startGame(idUser, valorAposta);
        res.status(201).json({ gameId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const reveal = async (req, res) => {
    try {
        const gameId = parseInt(req.params.gameId);
        const { linha, coluna } = req.body;
        const result = await gameService.revealPosition(gameId, linha, coluna);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const cashout = async (req, res) => {
    try {
        const gameId = parseInt(req.params.gameId);
        const result = await gameService.cashout(gameId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    start,
    reveal,
    cashout
};