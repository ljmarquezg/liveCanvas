var usuario = require('../controllers/usuario');
var passport = require('passport');
var fileUpload = require('express-fileupload');
var rutas = function (app) {

    app.use(fileUpload({
            limits: {fileSize: 50 * 1024 * 1024}
        }
    ));

    app.get('/registro', function (req, res) {
        res.render('registro');
    });

    app.get('/login', function (req, res) {
        checkAuthenticated(req, res, 'gallery')
    });

    app.get('/', function (req, res) {
        res.render('login');
    });

    app.get('/canvas', function (req, res) {
        checkAuthenticated(req, res, 'index');
    });

    app.get('/error', function (req, res) {
        res.render('login', {
            response: req.session.flash.error[0]
        });
    });

    app.get('/gallery', function (req, res) {
        checkAuthenticated(req, res, 'gallery');
    });

    app.post('/registro', usuario.registro, function (req, res) {
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

        uploadFile.mv('./public/uploads/' + uploadFileName, function (err) {
            if (err) return res.status(500).send(err);
            res.redirect('/gallery');
        });
    });

    function checkAuthenticated(req, res, url) {
        if (req.isAuthenticated() || req.session.passport.user !== undefined) {
            res.render(url, {
                usuario: req.session.passport.user
            });
        } else {
            res.redirect('/');
        }
    }
};

module.exports = rutas;