const db = require('../config/database');

const createGame = async (gameData) => {
    const { idUser, valorAposta, board } = gameData;
    const result = await db.query(
        'INSERT INTO jogos (id_user, valor_aposta, board) VALUES ($1, $2, $3) RETURNING id',
        [idUser, valorAposta, JSON.stringify(board)]
    );
    return result.rows[0];
};

const findGameById = async (id) => {
    const result = await db.query('SELECT * FROM jogos WHERE id = $1', [id]);
    return result.rows[0];
};

const findActiveGameByUserId = async (idUser) => {
    const result = await db.query('SELECT * FROM jogos WHERE id_user = $1 AND status = $2', [idUser, 'ANDAMENTO']);
    return result.rows[0];
};

const updateGameProgress = async (id, posicoesReveladas, diamantesEncontrados, premioAtual) => {
    const result = await db.query(
        'UPDATE jogos SET posicoes_reveladas = $1, diamantes_encontrados = $2, premio_atual = $3 WHERE id = $4 RETURNING *',
        [JSON.stringify(posicoesReveladas), diamantesEncontrados, premioAtual, id]
    );
    return result.rows[0];
};

const updateGameStatus = async (id, status) => {
    const result = await db.query(
        'UPDATE jogos SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

const getUserGameStats = async (idUser) => {
    const result = await db.query('SELECT status, valor_aposta, premio_atual FROM jogos WHERE id_user = $1', [idUser]);
    return result.rows;
};

module.exports = {
    createGame,
    findGameById,
    findActiveGameByUserId,
    updateGameProgress,
    updateGameStatus,
    getUserGameStats
};