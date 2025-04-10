const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getProducts = async (req, res) => {
  try {
    await client.connect();
     const result = await mongodb
                .getDatabase()
                .db()
                .collection("categories")
                .find().toArray();
    

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  } finally {
    await client.close();
  }
};