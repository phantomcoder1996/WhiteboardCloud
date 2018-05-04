var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./WHITEBOARD.sqlite3"
    },

    useNullAsDefault: true
});

var db=require('../db');
exports.getAnnounce=function(data,cb)
{
 var room_id=data.id;
 console.log(room_id);
 

 knex('annoncments').join('user_login','annoncments.user_id','=','user_login.user_id').join('Comments','Comments.anounce_id','annoncments.anounce_id').where('annoncments.room_id',room_id).select('annoncments.anounce_id','annoncments.anounce','annoncments.likes','Comments.comment_id','Comments.comment','annoncments.user_id','user_login.username','user_login.picture')

.then(
    
function(announce)
{  console.log(announce);
if(!announce) return cb(null,false);

return cb(null,announce);

})

.catch(
function(err)
{
return cb(err);
});

}


exports.delAnnounce=function(data,cb)
{ 
knex('annoncments').where('anounce_id',data.id).del()
.then(function(){console.log('anounce deleted');return cb();});

}

exports.insertAnnounce=function(data,cb)
{
       knex('annoncments').insert({
               // anounce_id: data.postid,
                anounce: data.anounce,
                user_id: data.userid,
                room_id: data.roomid,
                likes:data.like
            }).then(function(){console.log('anounce inserted');return cb();});

}
exports.updateAnnounce=function(data,cb)
{
    knex('annoncments')
    .where('anounce_id',data.anounceid)
.update({
    likes:data.likes
  //thisKeyIsSkipped: undefined
}).then(function(){console.log('anounce like updated');return cb();});

}
