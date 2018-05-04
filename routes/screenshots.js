var express = require('express');
var router = express.Router();
var http=require('http').Server(express());
var db=require('../db');
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');

router.get('/get_images/:room_id',verifyToken,function(req,res){


    jwt.verify(req.token,'secretkey',function(err,user)
    {
        console.log("verification sent");
        console.log(req.token+"from jwt .verify");
        if(err) {res.sendStatus(401); return;}
        console.log(err);
        var data2db=
            {
                room_id:req.params.room_id,
                user_id:user.user.id
            }
        db.screenshots.getScreenshots(data2db,function(err,dataS)
            {

                if (err) {console.log(err); response = { message:"error in retreiving from database",error:-4 }; res.end( JSON.stringify( response ) ); }
                else { console.log('sending'); response = { message:dataS,error:0 }; res.end( JSON.stringify( response ) );}
            }
        );});

});


router.post('/save_image',verifyToken,function(req,res){


    console.log(req);
    jwt.verify(req.token,'secretkey',function(err,user)
    {
        console.log("verification sent");
        console.log(req.token+"from jwt .verify");
        if(err) {res.sendStatus(401); return;}
        console.log(err);
        var data2db=
            {
                room_id:req.body.roomId,
                image:req.body.data,
                datetaken:req.body.date,
                user_id:user.user.id
            }
        db.screenshots.saveScreenshot(data2db,function(err,dataS)
            {

                if (err) {console.log(err); response = { message:"error in saving to database",error:-4 }; res.end( JSON.stringify( response ) );}
                else {console.log("1 record inserted"); response = { message:"inserted successfully",error:0 }; res.end( JSON.stringify( response ) );}
            }
        );});

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

module.exports=router;