var usuario = require('../controllers/usuario');
var path = require('path');
var fileUpload = require('express-fileupload');
var rutas = function (app) {

    app.use(fileUpload({
            limits: {fileSize: 50 * 1024 * 1024}
        }
    ));

    app.get('/registro', function (req, res) {
        res.render('registro');
    });

    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('gallery');
        } else {
            res.render('login');
        }
    });

    app.get('/', function (req, res) {
        res.render('login');
    });

    app.get('/canvas', function (req, res) {
        console.log(req.body);
        checkAuthenticated(req, res, 'index');
    });

    app.get('/error', function (req, res) {
        res.send(req.session.flash.error[0]);
    });

    app.get('/gallery', function (req, res) {
        checkAuthenticated(req, res, 'gallery');
    });

    app.post('/registro', usuario.registro, function (req, res) {
        console.log(req.files);
        res.redirect('/');
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/upload-form', function (req, res) {
        checkAuthenticated(req, res, 'upload-form');
    });

    app.post('/upload-form', function (req, res) {
        var success = false;
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let name = req.body.name;
        let uploadFile = req.files.uploadFile;
        let uploadFileName = uploadFile.name;
        let extPos = uploadFileName.split('.');
        let ext = '.' + extPos[extPos.length - 1];

        if (name.trim() != "") {
            uploadFileName = name + ext;
        }

        req.on('data', function(chunk){
            console.log(chunk);
        });

        uploadFile.mv('./public/uploads/' + uploadFileName, function (err) {
            if (err) return res.status(500).send(err);
            res.redirect('./canvas');
        });
    });

    function checkAuthenticated(req, res, url) {
        if (req.isAuthenticated()) {
            res.render(url, {
                usuario: req.session.passport.user.nombre
            });
        } else {
            app.get('/', function (req, res) {
                res.render('login');
            });
        }
    }
};

module.exports = rutas;