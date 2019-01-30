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
    color = $('#jscolor').attr('value'),
    nav = $('nav').outerHeight(),

    mouseEvents = {
        prevX: 0,
        prevY: 0,
        posX: 0,
        posY: 0,
        enabled: false,
        color: color,
        pencilWidth: pencilWidth,
        drawing: false,
    },

    me = mouseEvents;

$(window).on('load', function () {
    canvas = document.getElementById('canvas');

    if ($(canvas).length) {
        canvasActions = canvas.getContext("2d");
        canvasArea = $('.draw');
        init();
    }
});


//EVENTS ===========================================

$(document).on('mousedown', function (e) {
    var me = mouseEvents;
    me.prevX = e.clientX;
    me.prevY = e.clientY;
    me.posX = me.prevX;
    me.posY = me.prevY;
    me.enabled = true;
    socket.emit('drawing', {mouseEvents});
    updateCanvas();
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
        socket.emit('drawing', {mouseEvents});
        updateCanvas();
    }
})
;


$(document).on('mouseup', '#canvas', function (e) {

    me.prevX= e.clientX;
    me.prevY = e.clientY;
    me.posX = me.prevX;
    me.posY = me.prevY;

    me.drawing = false;
    me.enabled = false;

    socket.emit('drawing', {mouseEvents});
});


$(document).on('click', '#jscolortrigger', function () {
    document.getElementById('jscolor').jscolor.show();
});


//================= Funciones ===============

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

    updatePencilWidth(pencilWidth);
    calculateArea();
    resizeCanvas();

}

function calculateArea() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

function resizeCanvas() {
    calculateArea();
    draw();
}

function updatePencilWidth(value) {
    pencilWidth = value;
    $('.actualsize').width(pencilWidth)
        .height(pencilWidth)
        .css({'background-color': '#' + color});
    $('.pointervalue').html(pencilWidth);
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
        }

        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - nav - canvas.offsetTop;
        draw();
    }

}

function draw() {
    /*canvasActions.beginPath();
    canvasActions.moveTo(prevX, prevY);
    canvasActions.lineTo(currX, currY);
    canvasActions.strokeStyle = color;
    canvasActions.lineWidth = pencilWidth;
    canvasActions.stroke();
    canvasActions.closePath();*/
}


function updateCanvas() {
    socket.on('update canvas', function (draw) {
        console.log(draw);
        var e = draw.mouseEvents;
        canvasActions.beginPath();
        canvasActions.moveTo(e.prevX, e.prevY);
        canvasActions.lineTo(e.posX, e.posY);
        canvasActions.strokeStyle = e.color;
        canvasActions.lineWidth = e.pencilWidth;
        canvasActions.stroke();
        canvasActions.closePath();
        $('.footer').append('draw.posX: ' + e.posX);
    });
}


function pasteImage() {
    var img = document.getElementById("canvasimg");
    canvasActions.drawImage(img, 0, 0, canvasWidth, canvasHeight);
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        canvasActions.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

socket.on('load image', function (img) {
    console.log('load image triggered');
    console.log(img);
    $('#canvasimg').attr('src', img);
});

