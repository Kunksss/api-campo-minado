const gameRepository = require('../repositories/gameRepository');
const userRepository = require('../repositories/userRepository');

const generateBoard = () => {
    const board = Array(5).fill().map(() => Array(5).fill('DIAMANTE'));
    let bombsPlaced = 0;

    while (bombsPlaced < 5) {
        const row = Math.floor(Math.random() * 5);
        const col = Math.floor(Math.random() * 5);

        if (board[row][col] === 'DIAMANTE') {
            board[row][col] = 'BOMBA';
            bombsPlaced++;
        }
    }
    return board;
};

const startGame = async (idUser, valorAposta) => {
    const amount = parseFloat(valorAposta);

    if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor de aposta inválido');
    }

    const user = await userRepository.findUserById(idUser);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const currentBalance = parseFloat(user.saldo);
    if (currentBalance < amount) {
        throw new Error('Saldo insuficiente');
    }

    const activeGame = await gameRepository.findActiveGameByUserId(idUser);
    if (activeGame) {
        throw new Error('O usuário já possui uma partida em andamento');
    }

    const newBalance = currentBalance - amount;
    await userRepository.updateSaldo(idUser, newBalance.toFixed(2));

    const board = generateBoard();

    const game = await gameRepository.createGame({
        idUser,
        valorAposta: amount,
        board
    });

    return game.id;
};

const revealPosition = async (gameId, linha, coluna) => {
    const game = await gameRepository.findGameById(gameId);
    if (!game) {
        throw new Error('Jogo não encontrado');
    }

    if (game.status !== 'ANDAMENTO') {
        throw new Error('Este jogo já foi encerrado');
    }

    if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
        throw new Error('Posição inválida no tabuleiro');
    }

    const posicoesReveladas = typeof game.posicoes_reveladas === 'string' 
        ? JSON.parse(game.posicoes_reveladas) 
        : game.posicoes_reveladas;

    const alreadyRevealed = posicoesReveladas.some(pos => pos.linha === linha && pos.coluna === coluna);
    if (alreadyRevealed) {
        throw new Error('Esta posição já foi revelada. Escolha outra posição.');
    }

    const board = typeof game.board === 'string' ? JSON.parse(game.board) : game.board;
    const content = board[linha][coluna];

    posicoesReveladas.push({ linha, coluna });

    if (content === 'BOMBA') {
        await gameRepository.updateGameStatus(gameId, 'PERDIDO');
        return {
            resultado: 'BOMBA',
            status: 'PERDIDO'
        };
    }

    const diamantesEncontrados = game.diamantes_encontrados + 1;
    const valorAposta = parseFloat(game.valor_aposta);
    
    const premioAtual = valorAposta * (1 + (diamantesEncontrados * 0.33));
    const formattedPremio = parseFloat(premioAtual.toFixed(2));

    await gameRepository.updateGameProgress(gameId, posicoesReveladas, diamantesEncontrados, formattedPremio);

    return {
        resultado: 'DIAMANTE',
        diamantesEncontrados,
        premioAtual: formattedPremio
    };
};

const cashout = async (gameId) => {
    const game = await gameRepository.findGameById(gameId);
    if (!game) {
        throw new Error('Jogo não encontrado');
    }

    if (game.status !== 'ANDAMENTO') {
        throw new Error('Não é possível realizar saque em um jogo encerrado');
    }

    await gameRepository.updateGameStatus(gameId, 'FINALIZADO');

    const premioAtual = parseFloat(game.premio_atual);
    const user = await userRepository.findUserById(game.id_user);
    
    const currentBalance = parseFloat(user.saldo);
    const newBalance = currentBalance + premioAtual;
    
    await userRepository.updateSaldo(game.id_user, newBalance.toFixed(2));

    return {
        status: 'FINALIZADO',
        premioSacado: premioAtual
    };
};

module.exports = {
    startGame,
    revealPosition,
    cashout
};