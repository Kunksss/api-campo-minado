const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const validatePasswordRules = (senha) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
};

const registerUser = async (userData) => {
    const { nome, email, dataNascimento, senha, confirmacaoSenha } = userData;

    if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
        throw new Error('Todos os campos são obrigatórios');
    }

    if (senha !== confirmacaoSenha) {
        throw new Error('A senha e a confirmação de senha não coincidem');
    }

    if (!validatePasswordRules(senha)) {
        throw new Error('A senha não atende aos requisitos mínimos');
    }

    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        throw new Error('E-mail já cadastrado');
    }

    const hashedPassword = hashPassword(senha);

    const newUser = await userRepository.createUser({
        nome,
        email,
        dataNascimento,
        senha: hashedPassword
    });

    return newUser;
};

const authenticateUser = async (email, senha) => {
    if (!email || !senha) {
        throw new Error('E-mail e senha são obrigatórios');
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Credenciais inválidas');
    }

    const hashedPassword = hashPassword(senha);
    if (user.senha !== hashedPassword) {
        throw new Error('Credenciais inválidas');
    }

    return {
        nome: user.nome,
        email: user.email,
        dataNascimento: user.data_nascimento.toISOString().split('T')[0]
    };
};

const resetPassword = async (id, novaSenha) => {
    if (!id || !novaSenha) {
        throw new Error('ID e nova senha são obrigatórios');
    }

    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    if (!validatePasswordRules(novaSenha)) {
        throw new Error('A nova senha não atende aos requisitos mínimos');
    }

    const hashedNovaSenha = hashPassword(novaSenha);
    if (user.senha === hashedNovaSenha) {
        throw new Error('A nova senha não pode ser igual à senha atual');
    }

    await userRepository.updatePassword(id, hashedNovaSenha);
};

module.exports = {
    registerUser,
    authenticateUser,
    resetPassword
};