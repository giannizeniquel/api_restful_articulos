'use strict'
// express para el ruteo
let express = require('express');

// traigo el controlador para ocupar sus metodos
let ArticleController = require('../controllers/articleController');

//pido el router de express
let router = express.Router();

//multiparty para subida de archivos
let multiparty = require('connect-multiparty');

//le damos el dir de donde se suben, guardamos en una variable para pasarlo a la ruta luego
let md_upload = multiparty({ uploadDir: './upload/articles' });

// Rutas de prueba
router.post('/datos-cursos', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

// Rutas utiles (post para guardar o enviar datos al backen, get para obtenerlos y put para actualizarlos)
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
//le damos el dir de uploads como segundo parametro
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);

module.exports = router;