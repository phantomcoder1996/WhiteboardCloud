var express = require('express');
var router = express.Router();
var http=require('http').Server(express());
var db=require('../db');
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');



router.get('/',function(req,res){res.render('rooms');});

router.get('/get_rooms',function(req,res)
{
db.room.getRooms(function(err,room)
{

     if(err) throw err;
    console.log(room+'hi');
     res.send(room);
}
)});

router.use('/room/:roomNum',function(req,res,next){
//first check if the user is logged in
//TODO: Either redirect or send a message
if(!req.user) {console.log('user is not logged in');
res.redirect('/users/login');}

console.log(req.params.roomNum+ "from middle ware");

db.room.ifRoomExists(req.params.roomNum,function(err,exists){

if(!exists){
console.log("does not exists");
//TODO:adjust that to work with angular
res.status(404).send({'msg':'Room does not exist'});}
else
next();
})

});

router.use('/room/:roomNum',function(req,res,next)
{
//Now we need to check if the user is a member if not he shall be redirected to enter room password
var roomid=req.params.roomNum;
var data=
{
room_id:req.params.roomNum,
user_id:req.user.user_id
}

db.room.isMemberOfRoom(data,function(err,ismember)
{
   if(err) throw err;

   if(ismember) next();
   else
   {
   //TODO: Change this to work with angularso as to render the view of entering room password

   db.room.getRoomNameById(roomid,function(err,name)
   {
       if(err) throw err;
       res.render('roompass',{'roomname':name,'roomid':roomid});
   });

  // res.status(404).send({"msg":"not a member of the room"});
   }

   }
);
}
);



router.get('/room/:roomNum',function(req,res)
{
console.log(req);


res.render('room',{'room':req.params.roomNum,'user':req.user.username});
}
);

router.get('/createRoom',function(req,res){res.render('createRoom');});

router.post('/test',verifyToken,function(req,res){console.log(req.token);
console.log("test teest");});

router.post('/createRoom',verifyToken,function(req,res)
{
// if(!req.user) res.redirect('/users/login');

jwt.verify(req.token,'secretkey',function(err,user)
{
console.log("verification sent");
console.log(req.token+"from jwt .verify");
if(err) res.sendStatus(401);

     console.log(user);

   var password=req.body.password;
   var roomname=req.body.name;
  // var password="123";

       bcrypt.hash(password,10,function(err,hash){
       if(err) throw err;
       var data={roomname:roomname,password:hash};
        db.room.createRoom(data,function(err,notexists){if(err)throw err;

        if(!notexists)
        res.status(404).send({msg:'Room name already exists'});

          //If has been created
                   db.room.getRoomIdByName(roomname,function(err,roomid)
                        {
                       // console.log(roomid);
                        if(err) throw err;
                        var data={username:user.username,roomid:roomid[0].room_id};
                        console.log(data);
                        db.room.addMemberToRoom(data,function(err){if(err) throw err;})

//TODO: change this redirection
                        res.redirect('/rooms/room/'+roomid[0].room_id);
                        });

        });




       });
});
}


);


router.post('/joinRoom',function(req,res)
{
/*if(!req.user)
{
  res.redirect('users/login');

}
*/

var roomid=req.body.roomid;
var password=req.body.password;


var userid=req.user.user_id;

var data=
{
userid:userid,
roomid:roomid,
password:password
}

db.room.addMemberToRoom(data,function(err,success)
{
if(err) throw err;
if(!success) //TODO:change that behavior for angular
res.status(404).send({"msg":"wrong password"});
else
res.redirect('/rooms/room/'+roomid);
});



}
);


//TODO: may need to change that route
router.get('/userRooms/:userid',
function(req,res)
{
var userid=req.params.userid;
db.room.getAllUserRooms(userid,function(err,rooms){
if(err) throw err;
if(!rooms) res.status('404').send([]);

res.status('200').send(rooms);
});
});



function verifyToken(req,res,next)
{
const bearerHeader= req.headers.authorization;
console.log(req.headers.authorization);
if(typeof bearerHeader!='undefined')
{
    console.log("bearer header defined");
    var bearerheader=bearerHeader.split(' ');
    console.log(bearerheader);
    const bearerToken=bearerheader[1];

    req.token=bearerToken;
   console.log(req.token+"from verify token in routes/rooms");
    next();
}
else
res.sendStatus(403);
}


module.exports = router;
