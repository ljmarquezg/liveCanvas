var File = require('../models/files');


exports.uploadFile = function(req, res, next){
    var file = new File({
        nombre : req.body.nombre,
    });

    file.save(function (err, file){
        if (!err) {
            res.status(201);
            next();
        }else{
            res.status(500);
            res.send('Ha ocurrido un problema!');
        }
    });
};