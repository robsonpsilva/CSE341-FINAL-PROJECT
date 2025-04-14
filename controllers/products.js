const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllProducts = async (req, res) => {
    try {
        //#swagger.tags=["Products"]
        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("products")
            .find();

        // Convertendo o resultado em um array
        const products = await result.toArray();

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(products);
    } catch (error) {
        // Tratamento de erros
        console.error("Error fetching products:", error);

        // Retornando erro 500 (Internal Server Error) ao cliente
        res.status(500).json({error: "An error occurred while retrieving products." });
    }
};

const getSingleProduct = async (req, res) => {
    //#swagger.tags=["Products"]
    try {
        // Validação do formato do ID para garantir que seja válido
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const productId = new ObjectId(req.params.id);

        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("products")
            .find({ _id: productId });

        // Convertendo o resultado em um array
        const products = await result.toArray();

        // Verificando se o contato foi encontrado
        if (products.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(products[0]);
    } catch (error) {
        // Tratamento de erros inesperados
        console.error("Error fetching contact:", error);
        res.status(500).json({ error: "An error occurred while retrieving the product." });
    }
};

const insertProduct = async (req, res) => {
    //#swagger.tags=["Products"]
    try {
        const { name, category, price, stock, description, supplierid } = req.body;
    
        // Validação básica
        if (!name|| !category || !price || !stock || !description || !supplierid) {
            return res.status(400).json({ error: "All fields are required." });
        }
    
        // Obter referência da coleção do MongoDB
        const productsCollection = await mongodb.getDatabase().db().collection("products");
    
        // Inserir os dados na coleção
        const newProduct = {
            name,
            category,
            price,
            stock,
            description, 
            supplierid,
        };
    
        const result = await productsCollection.insertOne(newProduct);
    
        // Retorna a resposta de sucesso
        res.status(201).json({
            message: "Product saved successfully",
            productId: result.insertedId,
        });
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ error: "Failed to save product" });
    }
};

const deleteProduct= async (req, res) => {
    ///#swagger.tags=["Products"]
    try {
        const { id } = req.params; // Obtém o ID da URL
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid product id to delete a product.");
        }
        // Verificar se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Obter referência à coleção do MongoDB
        const contactsCollection = await mongodb.getDatabase().db().collection("products");

        // Excluir o contato com o ID fornecido
        const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });

        // Verificar se o contato foi encontrado e excluído
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Product not found." });
        }

        // Responder com sucesso
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting Product:", error);
        res.status(500).json({ error: "Failed to delete product." });
    }
};


// Função para atualizar um produto
const updateProduct = async (req, res) => {
    //#swagger.tags=["Products"]
    try {
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid product id to update a product.");
        }
        const { id } = req.params; // ID do registro a ser atualizado
        const { name, category, price, stock, description, supplierid } = req.body;
    
        // Validação básica
        if (!name|| !category || !price || !stock || !description || !supplierid) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Valida o formato do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Obter a coleção do MongoDB
        const productsCollection = await mongodb.getDatabase().db().collection("products");

        // Dados a serem atualizados
        const updatedData = {
            name,
            category,
            price,
            stock,
            description, 
            supplierid,
        };

        // Atualizar o contato pelo ID
        const result = await productsCollection.updateOne(
            { _id: new ObjectId(id) }, // Filtro pelo ID
            { $set: updatedData } // Atualização parcial
        );

        // Verifica se o registro foi encontrado e atualizado
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Product not found." });
        }

        res.status(200).json({ message: "Product updated successfully." });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product." });
    }
};


module.exports = {
    getAllProducts,
    getSingleProduct,
    insertProduct,
    deleteProduct,
    updateProduct
};