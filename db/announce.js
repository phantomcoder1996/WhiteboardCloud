var knex = require('knex')({
        client: 'mysql',
        connection: {
            host : '127.0.0.1',
            user : 'root',
            password : '',
            database : 'WHITEBOARD'
        },
        migrations: {
            tableName: 'knex_migrations'
        }

    }
);

var db=require('../db');
exports.getAnnounce=function(data,cb)
{
 var room_id=data.id;
 
 knex('annoncments').join('user_login','annoncments.user_id','=','user_login.user_id').join('Comments','Comments.anounce_id','annoncments.anounce_id').where('annoncments.room_id',room_id)
.then(

function(announce)
{
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
    .where('anounce_id', data.id)
.update({
    likes:data.like
  //thisKeyIsSkipped: undefined
}).then(function(){console.log('anounce like updated');return cb();});

}
