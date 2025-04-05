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

module.exports = {
    saveProduct,
    saveCategory
};

