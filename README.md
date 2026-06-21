# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas
* Node.js
* Express.js
* PostgreSQL
* dotenv
* cors
* nodemon

## Integrantes
* Luiz Otavio Faquim de Oliveira

## Instalação

Clone o repositório:
\`\`\`bash
git clone https://github.com/Kunksss/api-campo-minado.git
\`\`\`

Acesse a pasta do projeto:
\`\`\`bash
cd api-campo-minado
\`\`\`

Instale as dependências:
\`\`\`bash
npm install
\`\`\`

## Configuração do Banco de Dados

1. Crie um banco de dados no PostgreSQL chamado `campo_minado`.
2. Execute o arquivo `script.sql` fornecido na raiz do projeto para criar as tabelas necessárias.
3. Crie um arquivo `.env` na raiz do projeto utilizando o arquivo `.env.example` como base e configure suas credenciais.

## Executando a aplicação

Para iniciar o servidor em ambiente de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

A API estará disponível em: http://localhost:3000

## Endpoints

### Autenticação
* `POST /auth/register` - Cadastro de usuário
* `POST /auth/login` - Login
* `PATCH /auth/reset-password` - Redefinir senha

### Usuários
* `GET /users/{id}` - Retorna dados do usuário autenticado
* `GET /users/dashboard?userId={id}` - Retorna estatísticas de vitórias/derrotas
* `PUT /users/{id}` - Adicionar saldo
* `DELETE /users/{id}` - Excluir conta do usuário

### Jogos
* `POST /games/start` - Iniciar uma nova aposta
* `POST /games/{gameId}/reveal` - Revelar uma posição do tabuleiro
* `POST /games/{gameId}/cashout` - Encerrar aposta e sacar prêmio
