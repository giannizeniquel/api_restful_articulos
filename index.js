//archivo de entrada a la api, coneccion a la bd
'use strict'
let mongoose = require('mongoose');
let url = 'mongodb://127.0.0.1:27017/api_rest_blog';
let app = require('./app');
let port = 3900;

mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true })
    .then(()=>{
        // Crear servidor y escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:'+port);
        });
    });