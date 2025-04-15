const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Adiciona ou atualiza telefone e endereço
const updateUserDetails = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const userId = req.params.id;
    const { phone, address } = req.body;

    const userCollection = mongodb.getDatabase().db().collection("users");

    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { phone, address, updatedAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Error updating user details", error });
  }
};

// Busca detalhes do usuário por ID
const getUserDetails = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const userId = req.params.id;
    const userCollection = mongodb.getDatabase().db().collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

// Exclui telefone e endereço de um usuário
const deleteUserDetails = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const userId = req.params.id;
    const userCollection = mongodb.getDatabase().db().collection("users");

    const deleteResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { phone: "", address: "" }, $set: { updatedAt: new Date() } }
    );

    if (deleteResult.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User details deleted successfully" });
  } catch (error) {
    console.error("Error deleting user details:", error);
    res.status(500).json({ message: "Error deleting user details", error });
  }
};
const deleteUser = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const userId = req.params.id; // Obtém o ID do usuário dos parâmetros da requisição
    const userCollection = mongodb.getDatabase().db().collection("users");

    // Remove o documento do usuário com o ID fornecido
    const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(userId) });

    // Verifica se o usuário foi encontrado e deletado
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};
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
const updateUser = async (email, name) => {
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


      // Atualiza o campo "password" no banco
      const result = await mongodb
          .getDatabase()
          .db()
          .collection("users")
          .updateOne(
            { email }, // Filtro: busca o documento com o email fornecido
            { $set: { name } } // Operação: atualiza o campo "name" no documento
          );

      if (result.matchedCount === 0) {
          throw new Error("Unable to update user!");
      }

      return { message: "User saved with succes!" };
  } catch (error) {
      throw error;
  }
};

const newUserEndpoint = async (userData) => {
  try {
    // Verifica se o email já está cadastrado
    const existingUser = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .findOne({ email: userData.email });

    if (existingUser) {
      throw new Error("Email already registered!");
    }

    // Insere um novo usuário na coleção "users"
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .insertOne(userData);

    if (!result.acknowledged) {
      throw new Error("Error creating user!");
    }

    return { message: "User created successfully!" };
  } catch (error) {
    throw error;
  }
};



module.exports = {
    updateUserDetails,
    getUserDetails,
    deleteUserDetails,
    deleteUser,
    updateUser,
    createUser,
    newUserEndpoint
}
