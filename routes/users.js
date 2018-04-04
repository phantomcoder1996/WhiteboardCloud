var express = require('express');
var router = express.Router();
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db=require('../db');
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});







router.get('/login',function(req,res){ res.render('login');})

router.get('/signup',function(req,res,next)
{
  res.render('signup',{errors:null});
});


// passport.use(new LocalStrategy(
//     function(username, password, done) {
//         console.log(password);
//       db.user.findByUserName(username,function(err,user)
//       {  console.log(user);
//           if(err) throw err;
//           if(!user) return done(null,false,{message:'Invalid credentials'});
//           console.log(user[0]);
//           console.log(user[0].password_digest);
//               bcrypt.compare(password,user[0].password_digest,function(err,res)
//               {
//
//                   if(err) throw err;
//                   if(res){console.log('success'); return done(null,user[0]);}
//                   else
//                   {console.log('not success');
//                       return done(null,false,{message:'Invalid credentials'});}
//               }
//               );
//
//
//       });
//
//
//
//     }));
// //This function determines what user info shall be stored in the
// //session
// passport.serializeUser(function(user, done) {
//     console.log(user.user_id);
//     done(null, user.user_id);
// });
//
// passport.deserializeUser(function (id,cb) {
//     db.user.findById(id,function(err,user)
//     {
//         if(err) return cb(err);
//         return cb(null,user);
//     })
//
// });

// router.post('/login2',
//     passport.authenticate('local', {passReqToCallback: true,successRedirect:'/users/test', failureRedirect:'/users/testFailure',failureFlash: true}),
//     function(req, res) {
//
//       res.redirect('/users/test');
//
//       //  res.end(JSON.stringify({"msg":"hi"}));
//
//     });
//
// router.get('/test',function(req,res){
//
//     console.log(req.session);
//
//     res.send({"response":1,"userid":req.session.passport.user});
// });
//
// router.get('/testFailure',function(req,res)
// {
//     res.send({"response":0,"userid":-1});
// });



// router.post('/login',
//     passport.authenticate('local', function(req,res){
//         res.status(200).send({"msg": "send info"});
//         })
//     );
//


router.post('/login',function(req,res)
{
console.log(req);
    var username=req.body.username;
    var password=req.body.password;
    console.log(username);
    console.log(password);
    db.user.findByUserName(username,function(err,user)
    {  console.log(user);
        if(err) throw err;
        if(!user) res.send({response:"-1"});
        console.log(user[0]);
        console.log(user[0].password_digest);
        bcrypt.compare(password,user[0].password_digest,function(err,result)
            {

                if(err) throw err;
                if(result)
                {
                    var myuser=
                        {
                            username:username,
                            id:user[0].user_id,
                           // email:user[0].email
                        }
                    jwt.sign({'user':myuser},'secretkey',function(err,token)
                    {
                       // req.headers['authorization']=token;
                        req.headers.authorization=token;
                        console.log("authorization header: "+req.headers.authorization);
                        res.send({response:token});
                    });
                }
                else
                    res.send({response:"-1"});
            }
        );


    });
});


router.post('/signup', function(req, res){

    console.log(req.body);
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;


    // Validation

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();


    var errors = req.validationErrors();

    if(errors){
        // res.render('signup',{
        //     errors:errors
        // });

        res.status(401).send(errors);

        //TODO:Change this to deal with angular
        //res.status(200).send(errors);
    } else {

        db.user.addUser(req,function(err){if(err)throw err;
        });


//TODO:Change this to deal with angular
      //  req.flash('success_msg', 'You are registered and can now login');

       // res.redirect('/users/login');

        res.status(200).send({response:"success"});
    }
});


module.exports = router;
