const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info:{
        title: "eCommerce Api",
        description: "eCommerce CRUD Api"
    },
    host: "cse341-final-project-sgk7.onrender.com",
    schemes: ["https"]

    //host: "localhost:3000",
    //schemes: ["http"]
} 

const outputFile = "./swagger.json";
const endPointsFile = ["./routes/index","./server"];

swaggerAutogen(outputFile,endPointsFile,doc);