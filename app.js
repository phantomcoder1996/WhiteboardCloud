var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
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
var jwt=require('jsonwebtoken');



//Routes
var index = require('./routes/index');
var users = require('./routes/users');
var rooms = require('./routes/room');
var login = require('./routes/login');
var signup= require('./routes/signup');
var announce=require('./routes/announce');
var comment=require('./routes/comments');
var profile=require('./routes/profile');
var screenshots=require('./routes/screenshots');
var notebook=require('./routes/notebook');

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



// Add headers
app.use(function (req, res, next) {

    // // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    //
    // // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //
    // // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    //
    // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");



    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
    // Pass to next layer of middleware
    next();
});


// app.use('/room[0-9]+',rooms);
// app.use('/login',login);
// app.use('/signup',signup);

app.use(morgan('dev'));

//For passport
app.use(session({secret:'ihatebeingstupidevereverever',

    saveUninitialized: true,
    resave: true}));
//
// app.use(passport.initialize());
// app.use(passport.session());

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
app.use('/announce',announce);
app.use('/comments',comment);
app.use('/profile',profile);
app.use('/screenshots',screenshots);
app.use('/notebook',notebook);
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

// io.on('connection',function(socket)
// {
//     // console.log("someone is connected with id= "+socket.id);
//     // socket.emit("connect2");
//     // socket.on('addToRoom',function(data)
//     // {
//     //     console.log(data.username);
//     //     socket.username=data.username;
//     //     var roomname='room'+data.room;
//     //     console.log(roomname);
//     //     console.log(socket.username+'user has joined that room');
//     //     socket.join(roomname,function()
//     //     {
//     //         var rooms=Object.keys(socket.rooms);
//     //         var msg=socket.username+" has joined the room";
//     //         console.log(rooms);
//     //         io.to(roomname).emit('msg',msg);
//     //     });
//     // })
//     whiteBoardApp.initWhiteBoard(socket,io);
// });



//Socket functions


io.on('connection', function(socket) {
    console.log('user connected');

socket.on('joinRoom',function(roomId,username,userid){
    socket.join(roomId);
console.log(username);
socket.username = username;	 // we store the username in the socket session for this client
socket.roomid=roomId;
//usernames[username] = username;   // add the client's username to the global list

// echo to client they've connected
// socket.emit('new-user',roomId, 'you have connected');
//socket.to(roomId).emit('new-user', 'you have connected');

socket.to(roomId).broadcast.emit('newUser',{userName:username,userId:userid} );  // echo globally (all clients) that a person has connected
console.log({userName:username,userId:userid});
console.log('emit new');
//socket.to(roomId).emit('update-users', usernames+"*"+userid);   // update the list of users in chat, client-side

});


socket.on('update-chat', function(username,roomId,message,userId){
    console.log(message);
io.sockets.to(roomId).emit('update-chat',username, message);
});

socket.on('newMessage', function(rooomid,username,message,userId) {
    console.log(message);
    // io.emit('new-message',message);
    socket.to(rooomid).broadcast.emit('getMessage',{msg:username+"*"+message,userid:userId});
});


socket.on('newInit', function(room_id,type,color) {
    console.log('room id init :'+room_id);
    // io.emit('new-message',message);
    console.log(type,color);
    socket.to(room_id).broadcast.emit('getInit2',type+color);
});

    socket.on('joinBoard',function(roomId,username,userid){
        socket.join(roomId);
    console.log(username);
    socket.username = username;	 // we store the username in the socket session for this client
    socket.roomid=roomId;

});


socket.on('newDraw', function(room_id,type,X,Y) {
    console.log('room id init :'+room_id);
    // io.emit('new-message',message);
    console.log(type,X,Y);
    socket.to(room_id).broadcast.emit('getDraw',type+""+X+""+Y);
});


socket.on('disconnect',function() {
    console.log(socket.roomid);
    socket.to(socket.rooomid).broadcast.emit('disconnected',socket.username);
});
});






module.exports = app;
