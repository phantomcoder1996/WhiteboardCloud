var express = require('express');
var fileUpload = require('express-fileupload');
var router = express.Router();
var http=require('http').Server(express());
var db=require('../db');
var jwt=require('jsonwebtoken');


router.post('/insert_profile_picture',verifyToken,function(req,res)
{
	 //var token= req.params.token;
     jwt.verify(req.token,'secretkey',function(err,user)
     {
         console.log("verification sent");
         console.log(req.token+"from jwt .verify");
         if(err) res.sendStatus(401);
         if (!req.files)
				return res.status(400).send('No files were uploaded.');
         var file=req.files.uploaded_image;
         var data=
             {
                
                  userid:user.user.id,
                 // file1: req.files.uploaded_image,
		          img_name:file.name
                
 
 
             }
             if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
                file.mv('public/images/upload_images/'+file.name, function(err) {
                               
                    if (err)
  
                      return res.status(500).send(err);



                      db.profile.UpdateProfilePicture(data,function(err,profile)
                      {
          
                          if(err) throw err;
                          console.log(profile);
                          res.send(profile);
                      }
                  );
             



                      
                });    
                
                
        }
    });
 
 
});





router.get('/get_Profile',verifyToken,function(req,res)
{
    //var token= req.params.token;
    jwt.verify(req.token,'secretkey',function(err,user)
    {
        console.log("verification sent");
        console.log(req.token+"from jwt .verify");
        if(err) res.sendStatus(401);

        var data=
            {
               
                userid:user.user.id,
               


            }

        db.profile.getProfile(data,function(err,profile)
            {

                if(err) throw err;
                console.log(profile);
                res.send(profile);
            }
        );
    });


});






router.post('/update_password',verifyToken,function(req,res)
{
  //var token= req.params.token;
   // console.log(req);

  jwt.verify(req.token,'secretkey',function(err,user)
  {


      if(err) res.sendStatus(401);

      var data=
          {
             
              userid:user.user.id,
              oldpassword:req.body.oldpassword,
              password:req.body.password
             


          }

      db.profile.UpdatePassword(data,function(err,profile)
          {


              if(err) {res.send({res:0});}

              else if(!profile[0]) res.send({res:-1});
             else{ res.send({res:1});}

          }
      );
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

module.exports=router;