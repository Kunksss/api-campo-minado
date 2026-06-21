CREATE DATABASE campo_minado;

\c campo_minado;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    saldo NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE jogos (
    id SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    valor_aposta NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ANDAMENTO',
    board JSON NOT NULL,
    posicoes_reveladas JSON NOT NULL DEFAULT '[]',
    diamantes_encontrados INTEGER DEFAULT 0,
    premio_atual NUMERIC(10, 2) DEFAULT 0.00,
    FOREIGN KEY (id_user) REFERENCES usuarios(id) ON DELETE CASCADE
);