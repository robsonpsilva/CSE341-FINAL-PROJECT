const express = require('express');
const router = require('./routes'); // Importa as rotas definidas

const app = express();

// Middlewares globais
app.use(express.json()); // Middleware para interpretar JSON nas requisições

// Uso das rotas importadas
app.use(router);

module.exports = app; // Exporta o app configurado