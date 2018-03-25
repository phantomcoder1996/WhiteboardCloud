var express = require('express');
var router = express.Router();
var http=require('http').Server(express());
var db=require('../db');




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


router.get('/room/:roomNum',function(req,res)
{
console.log(req);


res.render('room',{'room':req.params.roomNum,'user':req.user.username});
}
);


module.exports = router;
