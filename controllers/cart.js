const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Criar um novo carrinho
const createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;
    const db = mongodb.db();
    const productsCollection = db.collection("products");
    const cartCollection = db.collection("cart");

    let totalPrice = 0;

    // Valida os itens e atualiza o estoque
    for (const item of items) {
      const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) });

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product?.name || 'unknown product'}` });
      }

      totalPrice += product.price * item.quantity;

      await productsCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        { $inc: { stock: -item.quantity } }
      );
    }

    const cart = {
      userId,
      items,
      totalPrice,
      createdAt: new Date(),
    };

    const result = await cartCollection.insertOne(cart);
    res.json({ message: "Cart created successfully", cartId: result.insertedId });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Error creating cart", error });
  }
};

// Ler um carrinho pelo ID
const getCartById = async (req, res) => {
  try {
    const cartId = req.params.id;
    const db = mongodb.db();
    const cartCollection = db.collection("cart");

    const cart = await cartCollection.findOne({ _id: new ObjectId(cartId) });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Atualizar um carrinho
const updateCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { items } = req.body;
    const db = mongodb.db();
    const cartCollection = db.collection("cart");

    const updateResult = await cartCollection.updateOne(
      { _id: new ObjectId(cartId) },
      { $set: { items, updatedAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart", error });
  }
};

// Deletar um carrinho pelo ID
const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const db = mongodb.db();
    const cartCollection = db.collection("cart");

    const deleteResult = await cartCollection.deleteOne({ _id: new ObjectId(cartId) });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Error deleting cart", error });
  }
};

module.exports = {
  createCart,
  getCartById,
  updateCart,
  deleteCart  

};