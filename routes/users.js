var express = require('express');
var router = express.Router();
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db=require('../db');
var bcrypt=require('bcrypt');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});







router.get('/login',function(req,res){ res.render('login');})

router.get('/signup',function(req,res,next)
{
  res.render('signup',{errors:null});
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(password);
      db.user.findByUserName(username,function(err,user)
      {  console.log(user);
          if(err) throw err;
          if(!user) return done(null,false,{message:'Invalid credentials'});
          console.log(user[0]);
          console.log(user[0].password_digest);
              bcrypt.compare(password,user[0].password_digest,function(err,res)
              {

                  if(err) throw err;
                  if(res){console.log('success'); return done(null,user[0]);}
                  else
                  {console.log('not success');
                      return done(null,false,{message:'Invalid credentials'});}
              }
              );


      });



    }));
//This function determines what user info shall be stored in the
//session
passport.serializeUser(function(user, done) {
    console.log(user.user_id);
    done(null, user.user_id);
});

passport.deserializeUser(function (id,cb) {
    db.user.findById(id,function(err,user)
    {
        if(err) return cb(err);
        return cb(null,user);
    })

});

router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {

        res.redirect('/');
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
        res.render('signup',{
            errors:errors
        });

        //TODO:Change this to deal with angular
        //res.status(200).send(errors);
    } else {

        db.user.addUser(req,function(err){if(err)throw err;
        });


//TODO:Change this to deal with angular
        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});


module.exports = router;
