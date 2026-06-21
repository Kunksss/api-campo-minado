const userService = require('../services/userService');

const getProfile = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userProfile = await userService.getUserProfile(id);
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getDashboard = async (req, res) => {
    try {
        const userId = req.query.userId || req.body.userId;
        const stats = await userService.getUserDashboard(parseInt(userId));
        res.status(200).json(stats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addBalance = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { saldo } = req.body;
        await userService.addBalance(id, saldo);
        res.status(200).json({ message: 'Saldo atualizado com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await userService.deleteUserAccount(id);
        res.status(200).json({ message: 'Usuário e jogos vinculados removidos com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    getDashboard,
    addBalance,
    deleteUser
};