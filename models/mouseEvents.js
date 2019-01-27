var models = require('./models'),
    Schema = models.Schema;

var mouseEvents = new Schema({
    usuario: String,
    posX: Number,
    posY: Number,
    enabled: Boolean,
    color: String,
    pencilWidth: Number

});


var MouseEvents = models.model('MouseEvents', mouseEvents, 'mouseEvents');

module.exports = MouseEvents;