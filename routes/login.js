// var express=require('express');
// var router=express.Router();
// var passport=require('passport');
// var Strategy=require('passport-local').Strategy;
// var bcrypt=require('bcrypt');
// var db=require('../db');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var app=express();
//
// //Now define the strategy with a verification function
// var verification=function(username,password,cb)
// {
//     console.log(username);
//
//     db.user.findByUserName(username,function(err,user)
//     {console.log(username);
//      console.log(user);
//         if(err){console.log(err); return cb(err);}
//         if(!user) return cb(null,false);
//         bcrypt.hash(password,10,function(err,hash)
//         {
//             if(err) return cb(err);
//             bcrypt.compare(user.password_digest,hash,function(err,res)
//             {if(res){return cb(null,user);} else{return cb(null,false);}});
//         });
//   // return cb(null,user);
//
//     });
//
//     var user={id:2,username:'Reem',password_digest:123456};
//     console.log(user);
//  //   return cb(null,user);
// }
//
// var strategy=new Strategy(verification);
//
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// passport.use(strategy);
//
// //password authenticated session persistence
//
// //If a user is authenticated,session stores this information through out his http request
//
// passport.serializeUser(function(user,cb)
// {
//     console.log(user);
//     cb(null,user.id);
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
// //
//
//
//
// // app.use(passport.initialize());
// // app.use(passport.session());
//
// router.route('/')
//     .get(function(req,res){ res.render('login');})
//     .post(passport.authenticate('local',{failureRedirect:'/login'}),
//         function(req,res){res.redirect('/login');});
//
//
//
//
//
// module.exports=router;