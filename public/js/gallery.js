$(document).ready(function () {
    socket.on('get gallery', function (gallery) {
        var cards = '<div class="col s12 m4">';
        cards += '<div class="card">';
        cards += '<div class="card-image">';
        cards += '<img src="./img/emptycanvas.jpg">';
        cards += '</div>';
        cards += '<div class="card-content">';
        cards += '<p>Sin imágen de fondo</p>';
        cards += '</div>';
        cards += '<div class="card-action"><a href="#" class="imgtocanvas">Seleccionar Imágen</a></div>';
        cards += '</div>';
        cards += '</div>';

        $.each(gallery, function (i, file) {
            cards += '<div class="col s12 m4">';
            cards += '<div class="card">';
            cards += '<div class="card-image">';
            cards += '<img src="./uploads/' + file.name + '">';
            cards += '</div>';
            cards += '<div class="card-content">';
            cards += '<p>' + file.name + '</p>';
            cards += '</div>';
            cards += '<div class="card-action"><a href="#" class="imgtocanvas">Seleccionar Imágen</a></div>';
            cards += '</div>';
            cards += '</div>';
        });
        if (cards === '') {
            cards = '<h2> No se han encontrado imágenes </h2>';
            cards = '<a href="/upload-form">Cargar Imagen</a>';
        }
        $('#gallery').html(cards);
    });

    $(document).on('click', '.imgtocanvas', function () {
        var $this = $(this);
        var card = $this.closest(card);
        var imgURL = card.find('img').attr('src');
        socket.emit('canvas img', {image: imgURL});
    });
});