'use strict'

// Cargar modulos de node para crear servidor
let express = require('express');
let bodyParser = require('body-parser');

// Ejecutar express (http)
let app = express();

// Cargar ficheros, rutas

let article_routes = require('./routes/articleRoutes');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS

// Aniadir prefijos a rutas / Cargar rutas
app.use('/api', article_routes);

// Exportar modulo (fichero actual)
module.exports = app;