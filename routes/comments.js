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

    if(err) {  res.send({response:"-1"}); throw err;}
    console.log(announce);
    //res.send(announce);

    res.send({response:"1"});
}
)});





router.post('/insert_comment',verifyToken,function(req,res)
{
    //var token= req.params.token;
    jwt.verify(req.token,'secretkey',function(err,user)
    {
        console.log("verification sent");
        console.log(req.token+"from jwt .verify");
        if(err) res.sendStatus(401);

        var data=
            {
                comment: req.body.comment,
                userid:user.user_id,
                roomid: req.body.roomid,
                anounceid:req.body.announceid,


            }

        db.comments.insertComment(data,verifyToken,function(err,comments)
            {

                if(err) {  res.send({response:"-1"}); throw err;}
                console.log(announce);
                //res.send(announce);

                res.send({response:"1"});
            }
        );
    });


});






router.post('/update_comment',verifyToken,function(req,res)
{
	var data=
	{
                id: req.body.commentid,
                comment:req.body.comment,
               
	
	}

db.comments.updateComment(data,verifyToken,function(err,comments)
{

    if(err) {  res.send({response:"-1"}); throw err;}
    console.log(announce);
    //res.send(announce);

    res.send({response:"1"});
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