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

$(document).on('click','.js-toggler', function(){
    $('.submenu').slideDown('slow');
    var target = $(this).data('target');
    console.log(target);
    if($(target).hasClass('visible')){
        $(target).removeClass('visible').hide('slow');
    }else{
        $(target).addClass('visible').show('slow');
    }
    console.log($(target));
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
    $('#cuerpo-online').html('');
    $.each(usuarios, function (i, usuario) {
        $('#cuerpo-online').append($('<li>').text(usuario));
    });
});