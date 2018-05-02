var express = require('express');
var router = express.Router();
var http=require('http').Server(express());
var db=require('../db');

var jwt=require('jsonwebtoken');

router.get('/delete_Comment/:commentid',verifyToken,function(req,res)
{
	var data=
	{
	id:req.params.commentid,

	}

db.comments.delComment(data,function(err,comments)
{

     if(err) throw err;
     console.log(comments);
    // res.send(announce);
}
)});





router.get('/insert_comment/:comment/:roomid/:anounceid',verifyToken,function(req,res)
{
    //var token= req.params.token;
    jwt.verify(req.token,'secretkey',function(err,user)
    {
        console.log("verification sent");
        console.log(req.token+"from jwt .verify");
        if(err) res.sendStatus(401);

        var data=
            {
                comment: req.params.comment,
                userid:user.user_id,
                roomid: req.params.roomid,
                anounceid:req.params.anounceid,


            }

        db.comments.insertComment(data,verifyToken,function(err,comments)
            {

                if(err) throw err;
                console.log(comments);
                //res.send(announce);
            }
        );
    });


});






router.get('/update_comment/:id/:comment',verifyToken,function(req,res)
{
	var data=
	{
                id: req.params.id,
                comment:req.params.comment,
               
	
	}

db.comments.updateComment(data,verifyToken,function(err,comments)
{

     if(err) throw err;
     console.log(comments);
     //res.send(announce);
}
)});



function verifyToken(req,res,next)
{
    console.log(req);
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