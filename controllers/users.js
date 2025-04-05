const mongodb = require("../data/database");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Função para criar um novo usuário
const createUser = async (email, name) => {
    try {
        // Verifica se o email já está cadastrado
        const existingUser = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .findOne({ email });

        if (existingUser) {
            throw new Error("Email already registered!");
        }

        // // Criptografa a senha
        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insere um novo usuário na coleção "users"
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .insertOne({ email, name });

        if (!result.acknowledged) {
            throw new Error("Error creating user!");
        }

        return { message: "User created successfully!" };
    } catch (error) {
        throw error;
    }
};

// Função para atualizar a senha do usuário
const updateUser = async (email, newPassword) => {
    try {
        // Verifica se o usuário existe
        const existingUser = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .findOne({ email });

        if (!existingUser) {
            throw new Error("User not found!");
        }

        // Criptografa a nova senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Atualiza o campo "password" no banco
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .updateOne(
                { email }, // Localiza o usuário pelo email
                { $set: { password: hashedPassword } } // Atualiza a senha
            );

        if (result.matchedCount === 0) {
            throw new Error("Unable to update user!");
        }

        return { message: "Password updated successfully!" };
    } catch (error) {
        throw error;
    }
};

// Função para autenticar o usuário (login)
const authenticateUser = async (email, password) => {
    try {
        // Verifica se o usuário existe pelo email
        const user = await mongodb
            .getDatabase()
            .db()
            .collection("users")
            .findOne({ email });

        if (!user) {
            throw new Error("User not found!");
        }

        // Compara a senha fornecida com o hash armazenado
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Incorrect password!");
        }

        // Retorna uma mensagem de sucesso ou informações do usuário
        return { message: "Authentication successful!", user };
    } catch (error) {
        throw error;
    }
};

const loginOAuth = (req, res, next) => {
    // Chama a função de autenticação do Passport
    passport.authenticate("github")(req, res, next);
};

module.exports = { authenticateUser, createUser, updateUser, loginOAuth };