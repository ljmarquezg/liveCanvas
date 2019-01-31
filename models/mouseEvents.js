var models = require('./models'),
    Schema = models.Schema;

var mouseEvents = new Schema({
    prevX: Number,
    prevY: Number,
    posX: Number,
    posY: Number,
    enabled: Boolean,
    color: String,
    pencilWidth: Number,
    drawing: false,
});


var MouseEvents = models.model('MouseEvents', mouseEvents, 'mouseEvents');

module.exports = MouseEvents;