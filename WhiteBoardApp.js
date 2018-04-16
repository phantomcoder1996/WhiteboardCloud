
var clientSocket;
var io;

exports.initWhiteBoard=function(socket,sio)
{
    clientSocket=socket;
    io=sio;

    //All events on the server side go here

    clientSocket.on('createRoom',createRoom);
    clientSocket.on('joinRoom',joinRoom);
    clientSocket.on('new-message',displayNewMessage);

    clientSocket.on('disconnect',disconnected);

    clientSocket.on('drawing',draw);

}

//For teacher (create Room)
function createRoom(roomID)
{

   this.join(roomID);
   this.emit('createRoom','You have successfully created the room');
}


//For teacher or student join Room
function joinRoom(roomID,username)
{
    console.log(roomID+ username+"from white board app event handler join room");

    this.join(roomID);
    var data=
        {
            username1:username
        }
   // io.sockets.in(roomID).emit('joinRoom',data);

    clientSocket.in(roomid).broadcast.emit('joinRoom',data);
}


function displayNewMessage(data)
{
    var message=data.message;
    var roomid=data.roomid;

    clientSocket.in(roomid).broadcast.emit('new-message',message);

}


function disconnected()
{
    console.log("user is disconnected");
}


function draw(data)
{
    var mydata=data.content;
    var roomid=data.roomid;

    clientSocket.in(roomid).broadcast.emit('drawing', mydata);

}