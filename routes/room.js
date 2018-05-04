var express = require('express');
var router = express.Router();
var http=require('http').Server(express());
var db=require('../db');
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');



router.get('/',function(req,res){res.render('rooms');});

router.get('/get_rooms',function(req,res)
{
jwt.verify(req.token,'secretkey',function(err,user)
{
db.room.getRooms(function(err,room)
{

     if(err) throw err;
    console.log(room+'hi');
     res.send(room);
}
);});

}
);

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

//checks if the user is a member of the room

router.get('/isMember/:roomid',verifyToken,function(req,res)
{



jwt.verify(req.token,'secretkey',function(err,user)
{
console.log(user);
console.log(user+ "from is member");
if(err) res.sendStatus(401);

var userid=user.user.id;
var data={
room_id:req.params.roomid,
user_id:userid
}

db.room.isMemberOfRoom(data,function(err,ismember)
{
   if(err) throw err;

   if(ismember)  res.send({member:1});
   else
   {
       res.send({member:0});
   }

   }
);


});

});



router.post("/verifyRoomPassword",verifyToken,function(req,res)
{
console.log(req);
            var password = req.body.password;
            var roomid =  req.body.roomid;
            var token=req.token;
            db.room.getRoomPassword(roomid,function(err,roompassword)
            {
              if(err) throw err;
              if(!roompassword) res.sendStatus(404);



                   //add user to room
                   jwt.verify(req.token,'secretkey',function(err,user)
                   {
                     if(err) throw err;

                     var userid= user.user.id;
                     var data={roomid:roomid,userid:userid,password:password};
                     db.room.addMemberToRoom(data,function(err,res1){if(err) throw err;

                     if(res1) res.send({status:1}); //user is member of room
                     else
                     res.send({status:0});
//user is not member of room
                     });

                   }




                    );




            });

});








router.use('/room/:roomNum',function(req,res)
{
//Now we need to check if the user is a member if not he shall be redirected to enter room password
//var roomid=req.params.roomNum;



if(err) res.sendStatus(401);

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
    var description=req.body.description;
    var userid=user.user.id;
 // var password="123";
  //var roomname="cmp5";
       bcrypt.hash(password,10,function(err,hash){
       if(err) throw err;
       var data={roomname:roomname,password:hash,description:description};
        db.room.createRoom(data,function(err,notexists){if(err)throw err;

        if(!notexists)
        res.status(200).send({msg:0}); //room exists

        else{

          //If has been created
                   db.room.getRoomIdByName(roomname,function(err,roomid)
                        {
                        console.log(roomid);
                        if(err) throw err;
                        var data={roomid:roomid[0].room_id,userid:userid,password:password};
                        console.log(data);
                        db.room.addMemberToRoom(data,function(err){if(err) throw err;})

//TODO: change this redirection
                        res.status(200).send({msg:1}); //room created and teacher added
                        });
              }

        });




       });
});
}


);


router.post('/joinRoom',function(req,res)
{


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
console.log(userid+"from user rooms");
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




//checks if a room exists and if a user is a member of that room

router.get('/isMember2/:roomid',verifyToken,function(req,res)
{


var roomi=req.params.roomid;

jwt.verify(req.token,'secretkey',function(err,user)
{
console.log(user);
console.log(user.user.id+ "from is member2");
if(err) res.sendStatus(401);

var userid=user.user.id;
var data={
room_id:roomi,
user_id:userid
}
console.log(roomi);
db.room.doesRoomExist(roomi,function(err,uroomid)
{
   console.log(uroomid);
  if(!uroomid) res.send({msg:-1});
  else
  {

     db.room.isMemberOfRoom(data,function(err,ismember)
     {
        if(err) throw err;

        if(ismember)  res.send({msg:1});
        else
        {
            res.send({msg:0});
        }

        }
     );

  }

}
);



});

});


router.post('/leaveRoom',function(req,res)
{
var roomid=req.body.roomid;
var userid=req.body.userid;

db.room.removeMemberFromRoom(roomid,userid);

});


module.exports = router;
