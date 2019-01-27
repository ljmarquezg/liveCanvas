var mongoose = require('mongoose');
var database = 'prueba1';
mongoose.connect('mongodb://localhost/'+database);
//mongoose.connect('mongodb://localhost/'+database);
module.exports = mongoose;