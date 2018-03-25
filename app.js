var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport=require('passport');
var localStrategy=require('passport-local');
var morgan=require('morgan');
var session=require('express-session');
var flash=require('connect-flash');
var expressValidator = require('express-validator');
var port=process.env.port||3001;
var whiteBoardApp=require('./WhiteBoardApp.js');




//Routes
var index = require('./routes/index');
var users = require('./routes/users');
var rooms = require('./routes/room');
var login = require('./routes/login');
var signup= require('./routes/signup');

//Init app
var app = express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
server.listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/room[0-9]+',rooms);
// app.use('/login',login);
// app.use('/signup',signup);

app.use(morgan('dev'));

//For passport
app.use(session({secret:'ihatebeingstupidevereverever',

    saveUninitialized: true,
    resave: true}));

app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


// Connect Flash
app.use(flash());

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


// Global Vars
app.use(function (req, res, next) {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use('/', index);
app.use('/users', users);
app.use('/rooms',rooms);
// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error2');
// });

// Set Port
// app.set('port', (process.env.PORT || 3000));
//
// app.listen(app.get('port'), function(){
//     console.log('Server started on port '+app.get('port'));
// });

io.on('connection',function(socket)
{
    // console.log("someone is connected with id= "+socket.id);
    // socket.emit("connect2");
    // socket.on('addToRoom',function(data)
    // {
    //     console.log(data.username);
    //     socket.username=data.username;
    //     var roomname='room'+data.room;
    //     console.log(roomname);
    //     console.log(socket.username+'user has joined that room');
    //     socket.join(roomname,function()
    //     {
    //         var rooms=Object.keys(socket.rooms);
    //         var msg=socket.username+" has joined the room";
    //         console.log(rooms);
    //         io.to(roomname).emit('msg',msg);
    //     });
    // })
    whiteBoardApp.initWhiteBoard(socket,io);
});



module.exports = app;
