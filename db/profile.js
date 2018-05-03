var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./WHITEBOARD.sqlite3"
    },

    useNullAsDefault: true
});

var db=require('../db');
exports.getProfile=function(data,cb)
{
var user_id=data.userid;

knex('user_login').join('snapshots','snapshots.user_id','=','user_login.user_id').join(
    Knex('room_members').join('room','room.room_id','room_members.room_id').join('user_login','user_login.user_id','room_members.user_id').where('room_members.user_id','=','user_login.user_id')
).where('user_login.user_id',user_id).select('user_login.user_id','snapshots.id','snapshots.shot','user_login.email','user_login.picture','room.name','room.room_id')
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


exports.UpdatePassword=function(data,cb)
{ 
    bcrypt.hash(data.oldpassword, 10, function (err, hash) {

        if (err){console.log(err); return cb(err);}
        else {  
            knex('user_login')
            .where('password_digest', hash)
           .then(

            function(profile)
            {
            if(!profile) return cb(null,false);
            else {
                bcrypt.hash(data.password, 10, function (err, hash) {
                    if (err){console.log(err); return cb(err);}
                    else {
            
                        console.log(hash);
                        knex('user_login')
                                .where('user_id', data.id)
                                .update({
                                    password_digest:hash
                              
                                }).then(function(){console.log('password updated');return cb();});
                  
            
                       }
            
                });
            }
          //  return cb(null,announce);
            
            })
   
     }
});
}

exports.UpdateProfilePicture=function(data,cb)
{ 
   

           
            knex('user_login')
                    .where('user_id', data.id)
                    .update({
                        picture:data.picture
                    
                    }).then(function(){console.log('picture updated');return cb();});
      

          

}
