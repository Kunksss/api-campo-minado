class Game {
    constructor(id, idUser, valorAposta, status, board, posicoesReveladas, diamantesEncontrados, premioAtual) {
        this.id = id;
        this.idUser = idUser;
        this.valorAposta = valorAposta;
        this.status = status;
        this.board = board;
        this.posicoesReveladas = posicoesReveladas;
        this.diamantesEncontrados = diamantesEncontrados;
        this.premioAtual = premioAtual;
    }
}

module.exports = Game;