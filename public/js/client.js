var socket = io();
var show = false;

window.onload = function () {
    var elems = document.querySelectorAll("input[type=range]");
    M.Range.init(elems);
};

$(document).on('click', '.close-sidebar', function(e){
    e.preventDefault();
});

function update(jscolor) {
    var selectedColor = '#' + jscolor;
    $('.color-picker').parent().css({'background-color': selectedColor});
    color = selectedColor;
}

$(document).ready(function () {
    $('.tooltipped').tooltip();
    $('.modal').modal();
    $('.sidenav').sidenav();
});

socket.on('new user', function () {
    $('#user-list').html('');
});

socket.on('append user', function (usuario) {
    $('#user-list').append(
        '<li class="user row valign-wrapper"><div class="profile">' +
        '<img src="' + usuario.image + '" alt="" class="circle responsive-img">' +
        '</div>' +
        '<div class="col s10">' +
        '<p class="black-text"><b>' + usuario.nombre + '</b></p>' +
        '</div>' +
        '</li>'
    );
});

socket.on('show user', function (user) {
    if (show === false) {
        var nombre = user.nombre;
        var username = user.usuario;
        var img = user.image;
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
        }, 3000)
        show = true;
    }
});

socket.on('show selected', function (img) {
    app.get('/canvas', function (req, res) {
        req.render('canvas', {'mensaje': 'test'});
    });
});

$(document).on('click', '[href="/logout"]', function(){
    socket.emit('disconnect');
});