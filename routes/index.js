const router = require('express').Router();

router.use("/",require("./swagger"));
router.get("/", (req,res) => {res.send(`<html>
            <head>
                <title>Robson Paulo da Silva</title>
            </head>
            <body>
                <h1>Welcome to Project: Contacts Part 2 Exercise</h1>
                <p>Click on the links below</p>
                <ul>
                    <li><a href=https://cse-341-project1-t08e.onrender.com/contacts>All contacts</a>></li>
                    <li><a href=https://cse-341-project1-t08e.onrender.com/contacts/67ca09d206dd9a333bc7be0e>Contact Id: ca09d206dd9a333bc7be0e </a></li>
                </ul>
            </body>
        </html>`);});


const productsController = require("../controllers/products");
const categoryController = require("../controllers/categories");

const cartController = require("../controllers/cart");

const userController = require("../controllers/users");

const {isAuthenticated} = require( "../middleware/authenticate");

const validation = require("../middleware/validate");

// Route for products
router.get(
    //#swagger.tags=[Get all products]
    "/products",isAuthenticated, productsController.getAllProducts); // Route to search all products
router.get("/products/:id", isAuthenticated, productsController.getSingleProduct); // Route to search for a product by ID
router.post("/products", isAuthenticated, validation.saveProduct, productsController.insertProduct); // Route to create product
router.delete("/products/:id", isAuthenticated, productsController.deleteProduct); //Route to delete a product
router.put("/products/:id", isAuthenticated, validation.saveProduct, productsController.updateProduct);//route to update product

//route for categories

router.get(
    //#swagger.tags=[Get all products]
    "/categories",isAuthenticated, categoryController.getAllCategories); // Route to search all Categories
router.get("/categories/:id", isAuthenticated, categoryController.getSingleCategory); // Route to search for a category by ID
router.post("/categories", isAuthenticated, validation.saveCategory, categoryController.insertCategory); // Route to create category
router.delete("/categories/:id", isAuthenticated, categoryController.deleteCategory); //Route to delete a category
router.put("/categories/:id", isAuthenticated,  validation.saveCategory, categoryController.updateCategory);//route to update category

router.get(
    //#swagger.tags=[Get carts by id]
    "/:id", isAuthenticated, cartController.getCartById); // Ler carrinho
router.post("/create", isAuthenticated,validation.validateCart, cartController.createCart); // Criar carrinho
router.put("/:id", isAuthenticated, validation.validateCart, cartController.updateCart); // Atualizar carrinho
router.delete("/:id", isAuthenticated, cartController.deleteCart); // Deletar carrinho


// Buscar dados do usuário
router.get(
    //#swagger.tags=[Get user by id]
    "/:id", userController.getUserDetails);


// Atualizar telefone e endereço
router.put(
    "/:id",
    validation.validateUserDetails,
    userController.updateUserDetails
  );
  
  
  // Excluir telefone e endereço
router.delete("/:id", userController.deleteUserDetails);


module.exports = router;