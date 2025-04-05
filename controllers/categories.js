const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllCategories = async (req, res) => {
     //#swagger.tags=["Categories"]
    try {
        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("categories")
            .find();

        // Convertendo o resultado em um array
        const itens = await result.toArray();

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(itens);
    } catch (error) {
        // Tratamento de erros
        console.error("Error fetching categories:", error);

        // Retornando erro 500 (Internal Server Error) ao cliente
        res.status(500).json({error: "An error occurred while retrieving categories." });
    }
};

const getSingleCategory = async (req, res) => {
    //#swagger.tags=["Categories"]
    try {
        // Validação do formato do ID para garantir que seja válido
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const itemId = new ObjectId(req.params.id);

        // Consulta ao banco de dados
        const result = await mongodb
            .getDatabase()
            .db()
            .collection("categories")
            .find({ _id: itemId });

        // Convertendo o resultado em um array
        const itens = await result.toArray();

        // Verificando se o contato foi encontrado
        if (itens.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Respondendo com sucesso
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(itens[0]);
    } catch (error) {
        // Tratamento de erros inesperados
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "An error occurred while retrieving the category." });
    }
};

const insertCategory = async (req, res) => {
    //#swagger.tags=["Categories"]
    try {
        const { name, description} = req.body;
    
        // Validação básica
        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required." });
        }
    
        // Obter referência da coleção do MongoDB
        const categoriesCollection = await mongodb.getDatabase().db().collection("categories");
    
        // Inserir os dados na coleção
        const newCategory= {
            name,
            description, 
        };
    
        const result = await categoriesCollection.insertOne(newCategory);
    
        // Retorna a resposta de sucesso
        res.status(201).json({
            message: "Category saved successfully",
            categoryId: result.insertedId,
        });
    } catch (error) {
        console.error("Error saving Category:", error);
        res.status(500).json({ error: "Failed to save Category" });
    }
};

const deleteCategory = async (req, res) => {
    //#swagger.tags=["Categories"]
    try {
        const { id } = req.params; // Obtém o ID da URL
        if(!ObjectId.isValid(req.params.id)){
            res.status(400).json("Must have a valid category id to delete a category.");
        }
        // Verificar se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Obter referência à coleção do MongoDB
        const categoryCollection = await mongodb.getDatabase().db().collection("categories");

        // Excluir o contato com o ID fornecido
        const result = await categoryCollection.deleteOne({ _id: new ObjectId(id) });

        // Verificar se o contato foi encontrado e excluído
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Category not found." });
        }

        // Responder com sucesso
        res.status(200).json({ message: "Category deleted successfully." });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category." });
    }
};


// Função para atualizar um contato
const updateCategory = async (req, res) => {
     //#swagger.tags=["Categories"]
    try {
        const { id } = req.params; // ID do registro a ser atualizado
        const { name, description} = req.body;

        // Valida o formato do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format." });
        }

        // Valida os dados enviados pelo cliente
        if (!name || !description) {
            return res.status(400).json({ error: "Name and Description." });
        }

        // Obter a coleção do MongoDB
        const categoryCollection = await mongodb.getDatabase().db().collection("categories");

        // Dados a serem atualizados
        const updatedData = {
            name,
            description, 
        };

        // Atualizar o contato pelo ID
        const result = await categoryCollection.updateOne(
            { _id: new ObjectId(id) }, // Filtro pelo ID
            { $set: updatedData } // Atualização parcial
        );

        // Verifica se o registro foi encontrado e atualizado
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Category not found." });
        }

        res.status(200).json({ message: "Category updated successfully." });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category." });
    }
};


module.exports = {
    getAllCategories,
    getSingleCategory,
    insertCategory,
    deleteCategory,
    updateCategory
};