var express = require('express');
var router = express.Router();
var http=require('http').Server(express());
var db=require('../db');



router.get('/get_Announce/:roomNum',verifyToken,function(req,res)
{
	var data=
	{
	id:req.params.roomNum,

	}

db.announce.getAnnounce(data,function(err,announce)
{

     if(err) throw err;
     console.log(announce);
     res.send(announce);
}
)});





router.get('/store_Announce/:anounce/:roomid/:like',verifyToken,function(req,res)
{
    //var token= req.params.token;
    jwt.verify(req.token,'secretkey',function(err,user)
    {
        console.log("verification sent");
        console.log(req.token+"from jwt .verify");
        if(err) res.sendStatus(401);

        var data=
            {
                anounce: req.params.anounce,
                userid:user.user_id,
                roomid: req.params.roomid,
                like:req.params.like


            }

        db.announce.insertAnnounce(data,verifyToken,function(err,announce)
            {

                if(err) throw err;
                console.log(announce);
                //res.send(announce);
            }
        );
    });


});






router.get('/del_Announce/:id',verifyToken,function(req,res)
{
	var data=
	{
		        id: req.params.id,
               
	
	}

db.announce.delAnnounce(data,verifyToken,function(err,announce)
{

     if(err) throw err;
     console.log(announce);
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