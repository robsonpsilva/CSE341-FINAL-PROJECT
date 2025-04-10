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
/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Operations related to managing products.
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retrieve all products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get(
    "/products",isAuthenticated, productsController.getAllProducts); // Route to search all products
router.get("/products/:id", isAuthenticated, productsController.getSingleProduct); // Route to search for a product by ID
router.post("/products", isAuthenticated, validation.saveProduct, productsController.insertProduct); // Route to create product
router.delete("/products/:id", isAuthenticated, productsController.deleteProduct); //Route to delete a product
router.put("/products/:id", isAuthenticated, validation.saveProduct, productsController.updateProduct);//route to update product

//route for categories

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Operations related to managing categories.
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Retrieve all categories
 *     responses:
 *       200:
 *         description: List of categories
 */

router.get(
    "/categories",isAuthenticated, categoryController.getAllCategories); // Route to search all Categories
router.get("/categories/:id", isAuthenticated, categoryController.getSingleCategory); // Route to search for a category by ID
router.post("/categories", isAuthenticated, validation.saveCategory, categoryController.insertCategory); // Route to create category
router.delete("/categories/:id", isAuthenticated, categoryController.deleteCategory); //Route to delete a category
router.put("/categories/:id", isAuthenticated,  validation.saveCategory, categoryController.updateCategory);//route to update category


/**
 * @swagger
 * tags:
 *   - name: Carts
 *     description: Operations related to shopping carts.
 */

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     tags:
 *       - Carts
 *     summary: Update cart items
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.get(
    "/carts/:id", isAuthenticated, cartController.getCartById); // Ler carrinho
router.post("/carts", isAuthenticated,validation.validateCart, cartController.createCart); // Criar carrinho
router.put("/carts/:id", isAuthenticated, validation.validateCart, cartController.updateCart); // Atualizar carrinho
router.delete("/carts/:id", isAuthenticated, cartController.deleteCart); // Deletar carrinho


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to managing users.
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a specific user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/user/:id", userController.getUserDetails);


// Atualizar telefone e endereço
router.put( "/user/:id",
    validation.validateUserDetails,
    userController.updateUserDetails
  );
  
  
  // Excluir telefone e endereço
router.delete("/user/:id", userController.deleteUserDetails);


module.exports = router;