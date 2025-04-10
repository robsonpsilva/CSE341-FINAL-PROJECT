const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Adiciona ou atualiza telefone e endereço
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const { phone, address } = req.body;

    const db = mongodb.db();
    const userCollection = db.collection("users");

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
  try {
    const userId = req.params.id;
    const db = mongodb.db();
    const userCollection = db.collection("users");

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
  try {
    const userId = req.params.id;
    const db = mongodb.db();
    const userCollection = db.collection("users");

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

module.exports = {
    updateUserDetails,
    getUserDetails,
    deleteUserDetails
}
