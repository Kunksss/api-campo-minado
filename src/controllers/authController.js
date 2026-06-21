const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        await authService.registerUser(req.body);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const userData = await authService.authenticateUser(email, senha);
        res.status(200).json(userData);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { id, novaSenha } = req.body;
        await authService.resetPassword(id, novaSenha);
        res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    resetPassword
};