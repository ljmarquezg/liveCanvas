var Usuario = require('../models/usuarios');


exports.registro = function(req, res, next){
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let name = req.body.usuario;
    let uploadFile = req.files.uploadFile;
    let uploadFileName = uploadFile.name;
    let extPos = uploadFileName.split('.');
    let ext = '.' + extPos[extPos.length - 1];

    if (name.trim() != "") {
        uploadFileName = name + ext;
    }

    uploadFile.mv('./public/uploads/' + uploadFileName, function (err) {
        if (err) return res.status(500).send(err);
    });


	var user = new Usuario({
		nombre : req.body.nombre,
		usuario : req.body.usuario,
		password : req.body.pass,
		image: './uploads/' + uploadFileName
	});

	user.save(function (err, usuario){
		console.log(usuario);
		if (!err) {
			res.status(201);
			next();
		}else{
			res.status(500);
			res.send('Ha ocurrido un problema!');
		}
	});
};


