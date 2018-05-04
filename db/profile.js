var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./WHITEBOARD.sqlite3"
    },

    useNullAsDefault: true
});

var db=require('../db');
var bcrypt=require('bcrypt');
exports.getProfile=function(data,cb)
{
var user_id=data.userid;
//.leftJoin('snapshots','snapshots.user_id','=','user_login.user_id')
//,'snapshots.id','snapshots.shot'
    knex('user_login').leftJoin('snapshots','snapshots.user_id','=','user_login.user_id').leftJoin('room','room.room_id','room_members.room_id').leftJoin('room_members','user_login.user_id','room_members.user_id')
  //  )
// knex('user_login').join('snapshots','snapshots.user_id','=','user_login.user_id').join(
//     Knex('room_members').join('room','room.room_id','room_members.room_id').join('user_login','user_login.user_id','room_members.user_id').where('room_members.user_id','=','user_login.user_id')
// )
//
.select('user_login.user_id','user_login.email','user_login.picture','room.name','room.room_id','snapshots.id','snapshots.shot').where('user_login.user_id',user_id)
.then(

function(profile)
{
if(!profile) return cb(null,false);

return cb(null,profile);

})

.catch(
function(err)
{
return cb(err);
});

}


exports.UpdatePassword2=function(data,cb)
{ 
    bcrypt.hash(data.oldpassword, 10, function (err, hash) {

        if (err){console.log(err); return cb(err);}
        else {  
            knex('user_login')
            .where('password_digest', hash)
           .then(

            function(profile)
            { console.log(data);
                console.log(profile);
            if(!profile) return cb(null,false);
            else {
                bcrypt.hash(data.password, 10, function (err, hash1) {
                    if (err){console.log(err); return cb(err);}
                    else {
            
                        console.log(hash1);
                        knex('user_login')
                                .where('user_id', data.id)
                                .update({
                                    password_digest:hash1
                              
                                }).then(function(){console.log('password updated');return cb();});
                  
            
                       }
            
                });
            }
          //  return cb(null,announce);
            
            })
   
     }
});
}



exports.UpdatePassword=function(data,cb)
{

    var password=data.password;
    var userid=data.userid;
    var oldpassword=data.oldpassword;

    db.user.getProfile(userid,function(err,profile)
        {

            if(err) return cb(err);
            bcrypt.compare(oldpassword,profile.password_digest,function (err,res) {

                if(err) return cb(err);

                if(res)
                {

                    bcrypt.hash(password, 10, function (err, hash) {
                        if (err){ return cb(err);}
                        else {



                            knex('user_login')
                                .where('user_id',userid)
                                .update({
                                    password_digest:hash

                                }).then(function(){console.log('password updated');return cb(null,profile)});


                        }

                    });
                }

                else
                {return cb(null,false);

                }



            });


        }

    );




}

exports.UpdateProfilePicture=function(data,cb)
{ 
   

           
            knex('user_login')
                    .where('user_id', data.id)
                    .update({
                        picture:data.img_name
                    
                    }).then(function(){console.log('picture updated');return cb();});
      

          

}
