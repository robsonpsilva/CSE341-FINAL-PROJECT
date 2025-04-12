const mongodb = require("../data/database");
 const bcrypt = require("bcrypt");
 const passport = require("passport");
 const ObjectId = require("mongodb").ObjectId;
 
 // Função para criar um novo usuário
 const createUser = async (email, name) => {
     try {
         // Verifica se o email já está cadastrado
         const existingUser = await mongodb
             .getDatabase()
             .db()
             .collection("users")
             .findOne({ email });
 // Adiciona ou atualiza telefone e endereço
 const updateUserDetails = async (req, res) => {
   try {
     const userId = req.params.id;
     const { phone, address } = req.body;
 
         if (existingUser) {
             throw new Error("Email already registered!");
         }
     const db = mongodb.db();
     const userCollection = db.collection("users");
 
         // // Criptografa a senha
         // const saltRounds = 10;
         // const hashedPassword = await bcrypt.hash(password, saltRounds);
     const updateResult = await userCollection.updateOne(
       { _id: new ObjectId(userId) },
       { $set: { phone, address, updatedAt: new Date() } }
     );
 
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
     if (updateResult.matchedCount === 0) {
       return res.status(404).json({ message: "User not found" });
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
     res.json({ message: "User details updated successfully" });
   } catch (error) {
     console.error("Error updating user details:", error);
     res.status(500).json({ message: "Error updating user details", error });
   }
 };
 
         // Atualiza o campo "password" no banco
         const result = await mongodb
             .getDatabase()
             .db()
             .collection("users")
             .updateOne(
                 { email }, // Localiza o usuário pelo email
                 { $set: { password: hashedPassword } } // Atualiza a senha
             );
 // Busca detalhes do usuário por ID
 const getUserDetails = async (req, res) => {
   try {
     const userId = req.params.id;
     const db = mongodb.db();
     const userCollection = db.collection("users");
 
         if (result.matchedCount === 0) {
             throw new Error("Unable to update user!");
         }
     const user = await userCollection.findOne({ _id: new ObjectId(userId) });
 
         return { message: "Password updated successfully!" };
     } catch (error) {
         throw error;
     if (!user) {
       return res.status(404).json({ message: "User not found" });
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
     res.json(user);
   } catch (error) {
     console.error("Error fetching user details:", error);
     res.status(500).json({ message: "Error fetching user details", error });
   }
 };
 
         // Compara a senha fornecida com o hash armazenado
         const isPasswordValid = await bcrypt.compare(password, user.password);
 // Exclui telefone e endereço de um usuário
 const deleteUserDetails = async (req, res) => {
   try {
     const userId = req.params.id;
     const db = mongodb.db();
     const userCollection = db.collection("users");
 
         if (!isPasswordValid) {
             throw new Error("Incorrect password!");
         }
     const deleteResult = await userCollection.updateOne(
       { _id: new ObjectId(userId) },
       { $unset: { phone: "", address: "" }, $set: { updatedAt: new Date() } }
     );
 
         // Retorna uma mensagem de sucesso ou informações do usuário
         return { message: "Authentication successful!", user };
     } catch (error) {
         throw error;
     if (deleteResult.matchedCount === 0) {
       return res.status(404).json({ message: "User not found" });
     }
 };
 
 const loginOAuth = (req, res, next) => {
     // Chama a função de autenticação do Passport
     passport.authenticate("github")(req, res, next);
     res.json({ message: "User details deleted successfully" });
   } catch (error) {
     console.error("Error deleting user details:", error);
     res.status(500).json({ message: "Error deleting user details", error });
   }
 };
 
 module.exports = { authenticateUser, createUser, updateUser, loginOAuth };
 module.exports = {
     updateUserDetails,
     getUserDetails,
     deleteUserDetails
 }