var express=require('express');
var db=require('../db/notebook');
var router=express.Router();
console.log("helllo");
router.post("/",function(req,res)
{
    console.log("d5555555555l");
    console.log(req.body.room);
    res.send('hello world from back');
    db.insert(req.body.content,req.body.id,req.body.room,req.body.name);

});

router.post("/getNote",function(req,res)
{
    console.log("d5555555555l get");
    console.log(req.body.id);
    //db.getNotes(req.body.id);
    // console.log(db.getNotes(req.body.id));
    // res.send(db.getNotes(req.body.id));
    db.getNotes(req.body.id,req.body.room,function(err,notes){
        if(err) throw err;
        console.log(notes);
        res.send(notes);
    })

});
module.exports=router;