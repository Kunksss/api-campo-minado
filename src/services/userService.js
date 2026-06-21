const userRepository = require('../repositories/userRepository');
const gameRepository = require('../repositories/gameRepository');

const getUserProfile = async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        saldo: parseFloat(user.saldo)
    };
};

const getUserDashboard = async (userId) => {
    if (!userId) {
        throw new Error('ID do usuário é obrigatório');
    }

    const stats = await gameRepository.getUserGameStats(userId);
    
    let totalJogos = stats.length;
    let vitorias = 0;
    let derrotas = 0;
    let valorGanho = 0;
    let valorPerdido = 0;

    stats.forEach(game => {
        if (game.status === 'FINALIZADO') {
            vitorias++;
            valorGanho += parseFloat(game.premio_atual);
        } else if (game.status === 'PERDIDO') {
            derrotas++;
            valorPerdido += parseFloat(game.valor_aposta);
        }
    });

    return {
        totalJogos,
        vitorias,
        derrotas,
        valorGanho: parseFloat(valorGanho.toFixed(2)),
        valorPerdido: parseFloat(valorPerdido.toFixed(2))
    };
};

const addBalance = async (id, saldoToAdd) => {
    const value = parseFloat(saldoToAdd);
    if (isNaN(value) || value < 0) {
        throw new Error('Não é permitido cadastrar saldo negativo ou inválido');
    }

    const formattedValue = Math.floor(value * 100) / 100;
    
    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const newBalance = parseFloat(user.saldo) + formattedValue;
    await userRepository.updateSaldo(id, newBalance.toFixed(2));
};

const deleteUserAccount = async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    await userRepository.deleteUser(id);
};

module.exports = {
    getUserProfile,
    getUserDashboard,
    addBalance,
    deleteUserAccount
};