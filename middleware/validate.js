const validator = require("../helpers/validate");

const saveProduct = (req, res, next) =>  {
    const validationRule = {
        name: "required|string",
        category: "required|string",
        stock: "required|numeric",
        price: "required|numeric",
        description: "string",
        supplierid: "required|string"
    };
    validator(req.body, validationRule, {}, (err,status) => {
        if (!status){
            res.status(413).send({
                success: false,
                message: "Product validation failed",
                data: err
            });
        } else{
            next();
        }
    });
};


const saveCategory = (req, res, next) =>  {
    const validationRule = {
        name: "required|string",
        description: "required|string",
    };
    validator(req.body, validationRule, {}, (err,status) => {
        if (!status){
            res.status(413).send({
                success: false,
                message: "Category validation failed",
                data: err
            });
        } else{
            next();
        }
    });
};

const validateCart = (req, res, next) => {
    const { userId, items } = req.body;
  
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }
  
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart items cannot be empty" });
    }
  
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid product or quantity" });
      }
    }
  
    next();
  };

  const validateUserDetails = (req, res, next) => {
    const { phone, address } = req.body;
  
    if (phone && typeof phone !== "string") {
      return res.status(400).json({ message: "Invalid phone number" });
    }
  
    if (address) {
      const { street, city, state, zip } = address;
      if (
        !street || typeof street !== "string" ||
        !city || typeof city !== "string" ||
        !state || typeof state !== "string" ||
        !zip || typeof zip !== "string"
      ) {
        return res.status(400).json({ message: "Invalid address format" });
      }
    }
  
    next();
  };

module.exports = {
    saveProduct,
    saveCategory,
    validateCart,
    validateUserDetails
};

