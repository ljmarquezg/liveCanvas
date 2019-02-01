var mongoose = require('mongoose');
var database = 'canvas';
mongoose.connect('mongodb://localhost/'+database);
module.exports = mongoose;