var port = 3000;
var express = require('express');
var app = express();
var fs = require('fs');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var client = redis.createClient();

//Aquí almacenamos las variables de sesión
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

//Passport
var passport = require('passport');

//Flash para enviar mensajes temporales como respuesta
var flash = require('connect-flash');

//Logger de peticiones http
var logger = require('morgan');
//Parsea las cookies y pobla el objeto req.cookies con un objeto de llaves, que tiene el nombre de la cookie
var cookieParser = require('cookie-parser');
//Parsea el cuerpo de las peticiones y respuestas http
var bodyParser = require('body-parser');

var path = require('path');
var _ = require('lodash');


//Requerimos Swig
var swig = require('swig');

var Usuario = require('./models/usuarios');
var MouseEvents = require('./models/mouseEvents');

/**************Configuración**************/

//Con esto le decimos a express, que motor de template utilizar, a lo que asignamos Swig.
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//En desarrollo deshabilitamos el cacheo de templates, pero en un entorno de desarrollo es esencial, para el optimo rendimiento.
//Leccion 4
app.set('view cache', false);
swig.setDefaults({cache: false});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Necesario para la gestión de las variables de sesión
var sessionManager = session({
    store: new RedisStore({}),
    secret: 'canvasapp'
});
app.use(sessionManager);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**************Configuración**************/

passport.serializeUser(function (user, done) {
    console.log("Serialize: " + user);
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log("Deserialize: " + obj);
    done(null, obj);
});

//Routes
var routes = require('./routes/routes');
routes(app);

//Connections 
var local = require('./connections/local');
local(app);
var twitter = require('./connections/twitter');
twitter(app);


//Socket.io
io.use(function (socket, next) {
    sessionManager(socket.request, socket.request.res, next)
});

io.on('connection', function (socket) {
    var loggedUser = socket.request.session.passport.user;
    if (loggedUser !== undefined) {
        var userId = loggedUser._id;
    } else {
        app.get('/', function (req, res) {
            res.render('/');
        });
    }

    socket.on('disconnect', function () {
        var loggedUser = socket.request.session.passport.user;
        if (loggedUser !== undefined) {
            client.hdel("usuarios", loggedUser._id);
        }
        console.log("Usuario desconectado: " + socket.id);
    });

    socket.on('new user', function () {
        var loggedUser = socket.request.session.passport.user;
        io.emit('new user');
        if (loggedUser !== undefined) {
            client.hset("usuarios", loggedUser._id, JSON.stringify(loggedUser));
            client.hgetall("usuarios", function(err, user){
                _.forEach(user, function (user, key) {
                    io.emit('append user', JSON.parse(user));
                });
            });
            socket.broadcast.emit('show user', loggedUser);
        }
    });

    socket.on('drawing', function (cords) {
        io.emit('update canvas', cords);
    });

    socket.on('get gallery', function (gallery) {
        //obtener todos los archivosen directorio
        var dir = path.join(__dirname, 'public/uploads');
        fs.readdir(dir, (err, files) => {
            var list = [];
            files.forEach((file) => {
                createList(file);
                function createList(file) {
                    fs.stat(dir + '/' + file, (err, stat) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        if (stat.isDirectory()) list.push({name: file, type: 'dir'});
                        else if (stat.isFile()) list.push({name: file, type: 'file'});
                        else list.push(0);
                        if (list.length == files.length) {
                            list.filter((m) => {
                                socket.emit(m);
                                return m;
                            });
                            io.emit('get gallery', list);
                        }
                    });
                }
            });
        });
    });

    socket.on('save img', function (img) {
        client.hset("canvasimg", userId, img);
    });

    socket.on('load image', function () {
        client.hgetall("canvasimg", function (err, key) {
            _.forEach(key, function (url, key) {
                if (key == userId) {
                    io.emit('paste img', url)
                }
            });
        });

    });
});

server.listen(port, function () {
    console.log('Servidor corriendo en el puerto ' + port);
});


