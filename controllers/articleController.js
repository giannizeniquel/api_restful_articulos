'use strict'

let validator = require('validator');
let Article = require('../models/article');
const article = require('../models/article');
// fs (file system) y path para manejo de archivos
let fs = require('fs');
let path = require('path');


let controller = {
    datosCurso: (req, res) => {
        let hola = req.body.hola;

        return res.status(200).send({
            nombre: "Gianni Ivan",
            apellido: "Zeniquel",
            mail: "gianni@gianni.com",
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Accion TEST del controller'
        });
    },

    // insertamos un articulo en la bd
    save: (req, res) => {
        // tomar los parametros por post
        let params = req.body;
        let validate_title;
        let validate_content;
        
        // validar datos con libreria validator
        try {
            validate_title = !validator.isEmpty(params.title);
            validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_title && validate_content) {
            // crear el objeto a guardar
            let article = new Article();

            // asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // guardar el articulo
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }
                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos !!!'
            });
        }

        
    }, // end save

    // obtenemos todos los articulos o si mandamos un parametro devolvemos los ultimos 5
    getArticles: (req, res) => {

        let query = Article.find({});
        let last = req.params.last;
         
        // si viene un parametro limito la cantidad de articulos que devuelve la query
        if(last || last != undefined){
            query.limit(5);
        }
        // find para sacar los datos de la bd
        // sort('-_id') para ordenar por id mas reciente 
        query.sort('-_id').exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!!'
                });
            }
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                message: articles
            });
        });

        
    }, // end getArticles

    // buscamos y devolvemos un articulo en concreto
    getArticle: (req, res) =>{

        // capturar el id del articulo de la url
        let article_id = req.params.id;

        // comprobar que existe
        if(!article_id || article_id == null){
            return res.status(404).send({
                status: 'error',
                message: 'No exiete el articulo'
            });
        }

        // buscar el articulo
        Article.findById(article_id, (err, article) =>{

            if(err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No exiete el articulo'
                });
            }
            // devolverlo en json
            return res.status(404).send({
                status: 'success',
                article
            });
        });
    }, // end getArticle

    // actualizar datos de un articulo
    update: (req, res) =>{

        // capturar el id del articulo de la url
        let article_id = req.params.id;

        // capturar los datos que llegan por put
        let params = req.body;

        // validar los datos
        let validate_title;
        let validate_content;
        try {
            validate_title = !validator.isEmpty(params.title);
            validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title || validate_content) {
            // realizamos la consulta (find and update)
            Article.findOneAndUpdate({_id: article_id}, params, {new: true}, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta !!!'
            });
        }
    }, // end update

    // actualizar datos de un articulo
    delete: (req, res) => {

        // capturar el id del articulo de la url
        let article_id = req.params.id;
        
        // realizamos la consulta (find and delete)
        Article.findOneAndDelete({_id: article_id}, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista !!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    }, // end delete

    //subida de archivos
    upload: (req, res) => {
        // configurar el modulo del connect multiparty (lib para subida de archivos) en router/articleRoutes.js

        // obtener el fichero de la peticion
        let file = req.files;

        if (!file || file == null) {
            return res.status(404).send({
                status: 'error',
                message: 'Imagen no subida...'
            });
        }

        // conseguir nombre y extension del archivo
        let file_path = req.files.file0.path;
        let file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // let file_split = file_path.split('/');

        // nombre del archivo
        let file_name = file_split[2];

        // extension del fichero
        let extension_split = file_name.split('\.');
        let file_extension = extension_split[1];

        // comprobar la extension, restringir solo a imagenes, si no es valida borrar fichero
        if (file_extension != 'png' && file_extension != 'jpg' && file_extension != 'jpeg' && file_extension != 'gif') {
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                    return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida !!!',
                    file_extension: file_extension
                });
            });
        }else{
            // si todo es valido 
            // capturo id del articulo de la url
            let article_id = req.params.id;

            // busco el articulo, asigno nombre de imagen y actualizo
            Article.findOneAndUpdate({_id: article_id}, {image: file_name}, {new: true}, (err, articleUpdated) => {

                if (err || !articleUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    }, // end upload file

    // obtener imagen de un articulo
    getImage: (req, res) => {
        // obtenemos el fichero
        let file = req.params.image;
        let path_file = './upload/articles/' + file;
        // comprobamos que exista con
        fs.exists(path_file, (exists)=> {
            if (exists){
                // sendFile es de express y path es la lib path importa
                return res.sendFile(path.resolve(path_file))
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    }, // end getImage

    search: (req, res) => {
        // sacar el string a buscar
        let search_str = req.params.search;

        // find or
        // 
        Article.find({ 
            "$or": [
                { "title": { "$regex": search_str, "$options": "i" } },
                { "content": { "$regex": search_str, "$options": "i" } }
            ]
        })
        .sort([
            ['date', 'descending'],
        ])
        .exec((err, articles)=>{

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error el la peticion',
                    err
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!!',
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
        
    }, // end search

}; // end controller

module.exports = controller;