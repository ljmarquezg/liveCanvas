let canvas = 0,
    canvasArea = 0,
    canvasActions,
    pencilWidth = 10,
    canvasWidth = 0,
    canvasHeight = 0,
    flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false,
    canvasimg = null,
    color = $('#jscolor').attr('value'),
    nav = $('nav').outerHeight(),

    mouseEvents = new MouseEvent({
        prevX: 0,
        prevY: 0,
        posX: 0,
        posY: 0,
        enabled: false,
        color: color,
        pencilWidth: pencilWidth,
        drawing: false,
    }),

    me = mouseEvents;

$(window).on('load', function () {
    canvas = document.getElementById('canvas');
    if ($(canvas).length) {
        canvasActions = canvas.getContext("2d");
        canvasArea = $('.draw');
        init();
    }
});

//================ MOUSEEVENTS ===============

$(document).on('mousedown', '#canvas', function (e) {
    var me = mouseEvents;
    me.prevX = e.clientX;
    me.prevY = e.clientY;
    me.posX = me.prevX;
    me.posY = me.prevY;
    me.enabled = true;
});

$(document).on('mousemove', '#canvas', function (e) {
    if (mouseEvents.enabled === true) {
        me.prevY = me.posX;
        me.posX = e.clientX;
        me.posY = e.clientY;
        me.enabled = true;
        me.drawing = true;
        me.color = color;
        me.pencilWidth = pencilWidth;
    }
});

$(document).on('mouseup', '#canvas', function (e) {
    me.prevX = e.clientX;
    me.prevY = e.clientY;
    me.posX = me.prevX;
    me.posY = me.prevY;
    me.drawing = false;
    me.enabled = false;
});

$(document).on('click', '#jscolortrigger', function () {
    document.getElementById('jscolor').jscolor.show();
});

//================= Functions ===============

function init() {
    var slider = document.getElementById('slider-range');
    canvasWidth = canvasArea.innerWidth();
    canvasHeight = canvasArea.innerHeight();
    noUiSlider.create(slider, {
        start: [pencilWidth],
        connect: true,
        step: 1,
        range: {
            'min': 1,
            'max': 20
        },
        format: wNumb({
            decimals: 0
        })
    });

    slider.noUiSlider.on('update', function (value) {
        updatePencilWidth(value);
    });

    window.addEventListener('resize', resizeCanvas, false);

    $(document).on('mouseenter', canvas, function (e) {
        $(document).on("mousemove", canvas, function (e) {
            getPosition('move', e)
        });
        $(document).on("mousedown", canvas, function (e) {
            getPosition('down', e)
        });
        $(document).on("mouseup", canvas, function (e) {
            getPosition('up', e)
        });
        $(document).on("mouseout", canvas, function (e) {
            getPosition('out', e)
        });
    });

    $(document).on('mouseout', canvas, function (e) {
        return false;
    });

    $(document).on('click', '#pasteImage', function () {
        pasteImage();
    });

    $(document).on('click', '.js-refresh', function () {
        erase();
    })

    if ($('#canvasimg').length === 0) {
        var img = document.createElement("img");
        img.setAttribute("id", "canvasimg");
        img.setAttribute("style", "display: none; opacity: 0; position: absolute; left: -100%");
        document.getElementById('main').appendChild(img);
        canvasimg = document.getElementById('canvasimg');
    }

    updatePencilWidth(pencilWidth);
    calculateArea();
    resizeCanvas();
    pasteImage();
}

function calculateArea() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

function resizeCanvas() {
    calculateArea();
}

function updatePencilWidth(pencilWidth) {
    $('.actualsize').width(pencilWidth)
        .height(pencilWidth)
        .css({'background-color': '#' + color});
    $('.pointervalue').html(pencilWidth);
}

function pasteImage() {
    socket.emit('load image');
}

function erase() {
    var restart = confirm("¿Desea eliminar los cambios?");
    if (restart) {
        canvasActions.clearRect(0, 0, canvasWidth, canvasHeight);
        document.getElementById("canvasimg");
    }
}

function getPosition(action, e) {
    if (action == 'down') {
        me.prevX = currX;
        me.prevY = currY;
        me.posX = e.clientX - canvas.offsetLeft;
        me.posY = e.clientY - nav - canvas.offsetTop;

        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - nav - canvas.offsetTop;

        flag = true;
        dot_flag = true;

        if (dot_flag) {
            canvasActions.beginPath();
            canvasActions.fillStyle = color;
            canvasActions.fillRect(currX, currY, pencilWidth, pencilWidth);
            canvasActions.closePath();
            dot_flag = false;
        }
    }
    if (action == 'up' || action == "out") {
        flag = false;
    }

    if (action == 'move') {
        if (flag) {
            me.prevX = currX;
            me.prevY = currY;
            me.posX = e.clientX - canvas.offsetLeft;
            me.posY = e.clientY - nav - canvas.offsetTop;
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - nav - canvas.offsetTop;
            socket.emit('drawing', {mouseEvents});
        }
    }

}

socket.on('update canvas', function (draw) {
    var e = draw.mouseEvents;
    var updatecolor = e.color;

    if (updatecolor !== undefined) {
        if (updatecolor.substr(0, 1) !== '#') {
            updatecolor = '#' + updatecolor;
        }
    }
    canvasActions.beginPath();
    canvasActions.moveTo(e.prevX, e.prevY);
    canvasActions.lineTo(e.posX, e.posY);
    canvasActions.strokeStyle = updatecolor;
    canvasActions.lineWidth = e.pencilWidth;
    canvasActions.stroke();
    canvasActions.closePath();
});


socket.on('paste img', function (img) {
    $(canvasimg).attr('src', img);
    canvasActions.drawImage(canvasimg, 0, 0);
});





