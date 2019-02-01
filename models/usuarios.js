var models = require('./models'),
	Schema = models.Schema;

var usuariosSchema = new Schema({
	nombre : String,
	usuario : String,
	password : String,
	twitter : String,
    image: String
});

var Usuario = models.model('Usuario', usuariosSchema, 'usuario_sesion');

module.exports = Usuario;
