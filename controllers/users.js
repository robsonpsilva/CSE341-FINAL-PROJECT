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
module.exports = {
    updateUserDetails,
    getUserDetails,
    deleteUserDetails,
    deleteUser
}
