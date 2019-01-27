var socket = io();
var usuario = {
//{
//    usuario | json_encode | safe
//}
    }
;

var show = false;

socket.emit('new user', usuario);
socket.emit('get gallery');

window.onload = function () {
    var elems = document.querySelectorAll("input[type=range]");
    M.Range.init(elems);
};

$(document).on('mousedown', function (e) {
    mouseEvents = {
        posX: e.clientX,
        posY: e.clientY,
        enabled: true,
    };
});

$(document).on('click', '#jscolortrigger', function(){
    document.getElementById('jscolor').jscolor.show();
});


function update(jscolor) {
    var selectedColor = '#' + jscolor;
    $('.color-picker').parent().css({'background-color': selectedColor});
    document.getElementById('jscolor').jscolor.hide();
    color = selectedColor;
}

$(document).on('mousemove', '#canvas', function (e) {
    if (mouseEvents.enabled === true) {
        mouseEvents = {
            posX: e.clientX,
            posY: e.clientY,
            enabled: true,
            drawing: true,
            color: color
        }
        socket.emit('drawing', {mouseEvents});
    }
});

$(document).ready(function(){
    $('.tooltipped').tooltip();
    $('.modal').modal();
});

$(document).on('mouseup', '#canvas', function (e) {
    mouseEvents = {
        posX: e.clientX,
        posY: e.clientY,
        drawing: false,
        enabled: false
    }
    socket.emit('drawing', {mouseEvents});
});


$('#form').submit(function (event) {
    socket.emit('chat message', {usuario: usuario, mensaje: $('#message').val()});
    $('#message').val('');
    return false;
});

socket.on('chat message', function (msg) {
    $('#cuerpo-chat').append($('<li>').html('<strong>' + msg.usuario + '</strong>: ' + msg.mensaje));
});

socket.on('new user', function (usuarios) {
    $.each(usuarios, function (i, usuario) {
        $('.footer').append(
        '<div class="col s12 m8 offset-m2 l6 offset-l3">'+
            '<div class="card-panel grey lighten-5 z-depth-1">'+
            '<div class="row valign-wrapper">'+
            '<div class="col s2">'+
            '<img src="images/yuna.jpg" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->'+
        '</div>'+
        '<div class="col s10">'+
            '<span class="black-text">'+
            usuario +
        '</span>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'
        )
        $('#cuerpo-online').append($('<li>').text(usuario));
    });
});

socket.on('show user', function(user){
    $('.username').text(user);
});

socket.on('load image', function(img){
   console.log('load image triggered');
   console.log(img);
    $('#canvasimg').attr('src', img);
});