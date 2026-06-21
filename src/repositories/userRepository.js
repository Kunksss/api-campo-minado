const db = require('../config/database');

const createUser = async (userData) => {
    const { nome, email, dataNascimento, senha } = userData;
    const result = await db.query(
        'INSERT INTO usuarios (nome, email, data_nascimento, senha) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, email, dataNascimento, senha]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
};

const findUserById = async (id) => {
    const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
};

const updatePassword = async (id, novaSenha) => {
    const result = await db.query(
        'UPDATE usuarios SET senha = $1 WHERE id = $2 RETURNING *',
        [novaSenha, id]
    );
    return result.rows[0];
};

const updateSaldo = async (id, novoSaldo) => {
    const result = await db.query(
        'UPDATE usuarios SET saldo = $1 WHERE id = $2 RETURNING *',
        [novoSaldo, id]
    );
    return result.rows[0];
};

const deleteUser = async (id) => {
    await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updatePassword,
    updateSaldo,
    deleteUser
};