const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info:{
        title: "eCommerce Api",
        description: "eCommerce CRUD Api"
    },
    host: "cse-341-project2-8oxr.onrender.com",
    schemes: ["http"]

    //host: "localhost:3000",
    //schemes: ["http"]
} 

const outputFile = "./swagger.json";
const endPointsFile = ["./routes/index"];

swaggerAutogen(outputFile,endPointsFile,doc);