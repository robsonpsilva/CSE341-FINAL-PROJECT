const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products'); // Controle dos produtos
const isAuthenticated = require('../middleware/authenticate'); // Middleware de autenticação


router.get(
    //#swagger.tags=[Get all products]
    "/products",isAuthenticated, productsController.getAll); // Route to search all products
router.get("/products/:id", productsController.getSingle); // Route to search for a product by ID
router.post("/products", productsController.insertProduct); // Route to create product
router.delete("/products/:id", productsController.deleteProduct); //Route to delete a product
router.put("/products/:id", productsController.updateProduct);//route to update product

module.exports = router;