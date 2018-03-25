var express=require('express');
var db=require('../db');
var router=express.Router();
var bodyParser = require('body-parser');

express().use(bodyParser.json());
express().use(bodyParser.urlencoded({ extended: false }));

router.route('/').post(function(req,res){ console.log(req);
    db.user.addUser(req,function(err){if(err)res.redirect('/signup');
else{res.redirect('/login');}});}).get(function(req,res){res.render('signup');});


module.exports=router;