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
exports.getPosts=function(cb)
{
 //var room_id=data.id;
 knex('Posts').join('user_login','Posts.user_id','=','user_login.user_id')
.then(

function(posts)
{
if(!posts) return cb(null,false);

return cb(null,posts);

})

.catch(
function(err)
{
return cb(err);
});

}
exports.delPosts=function(data,cb)
{
 knex('Posts').where('post_id',data.id).del().then(
       function(posts)
{
if(!posts) return cb(null,false);

return cb(null,posts);

})

.catch(
function(err)
{
return cb(err);
});

}
exports.insertPosts=function(data,cb)
{
       knex('Posts').insert({
              //  post_id: data.postid,
                post: data.post,
                user_id: data.userid,
                //room_id: data.roomid
            }).then(function(){console.log('post inserted');return cb();});

}