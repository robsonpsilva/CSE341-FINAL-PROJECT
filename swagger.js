const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "eCommerce Api",
        description: "eCommerce CRUD Api"
    },
    host: "localhost:3000",
    schemes: ["https", "http"],
    securityDefinitions: {
    googleOAuth: {
      type: "oauth2",
      description: "Google OAuth 2.0 authentication",
      flow: "accessCode",
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      scopes: {
        email: "View your email address",
        profile: "View your basic profile info"
      }
    }
  },
  security: [
    {
      googleOAuth: [
        "email",
        "profile"
      ]
    }
  ],
    
    // Alternative production host
    // host: "cse341-final-project-sgk7.onrender.com",
    // schemes: ["https"],
    
    // Google OAuth configuration
  
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js", "./server.js"]; // Fixed variable name and added .js extensions

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger documentation generated successfully");
});