var socket = io();
var usuario = {
//{
//    usuario | json_encode | safe
//}
    }
;

var show = false;

socket.emit('new user', usuario);

window.onload = function () {
    var elems = document.querySelectorAll("input[type=range]");
    M.Range.init(elems);
};



function update(jscolor) {
    var selectedColor = '#' + jscolor;
    $('.color-picker').parent().css({'background-color': selectedColor});
    //document.getElementById('jscolor').jscolor.hide();
    color = selectedColor;
}


$(document).ready(function () {
    $('.tooltipped').tooltip();
    $('.modal').modal();
});

socket.on('new user', function (usuarios) {
    console.log(usuarios);
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

socket.on('show user', function (user) {
    if (user.length > 0 && show === false) {
        var elemUsuario = user.slice(-1)[0];
        var nombre = elemUsuario.nombre;
        var username = elemUsuario.usuario;
        var img = elemUsuario.image;
        var popup = $('.popup');
        var username = $('.username');
        username.append(
            '<div class="card-panel grey lighten-5 z-depth-1">' +
            '<div class="row valign-wrapper"><div class="profile">' +
            '<img src="' + img + '" alt="" class="circle responsive-img">' +
            '</div>' +
            '<div class="col s10">' +
            '<p class="black-text"><b>' + nombre + '</b></p>' +
            '<span class="small">Ha iniciado sesión</span>' +
            '</div></div>' +
            '</div>'
        );
        popup.fadeIn();
        setTimeout(function () {
            popup.fadeOut();
            username.html('');
        }, 3000)
        show = true;
    }
});

socket.on('show selected', function(img){
    console.log(img);
    app.get('/canvas', function(req, res){
       req.render('canvas', {'mensaje': 'test'});
    });
});

socket.on('user disconnected', function(user){

});