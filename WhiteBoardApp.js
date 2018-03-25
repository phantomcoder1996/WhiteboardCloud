
var clientSocket;
var io;

exports.initWhiteBoard=function(socket,sio)
{
    clientSocket=socket;
    io=sio;

    //All events on the server side go here

    clientSocket.on('createRoom',createRoom);
    clientSocket.on('joinRoom',joinRoom);

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
    console.log(roomID+ "from white board app event handler join room");
    this.join(roomID);
    var data=
        {
            username:username
        }
    io.sockets.in(roomID).emit('joinRoom',data);
}
