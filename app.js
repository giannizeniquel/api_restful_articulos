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

// CORS para permitir las peticiones desde un cliente externo
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Aniadir prefijos a rutas / Cargar rutas
app.use('/api', article_routes);

// Exportar modulo (fichero actual)
module.exports = app;