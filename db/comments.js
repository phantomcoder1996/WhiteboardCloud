var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./WHITEBOARD.sqlite3"
    },

    useNullAsDefault: true
});

var db=require('../db');



exports.delComment=function(data,cb)
{ 
knex('Comments').where('comment_id',data.id).del()
.then(function(){console.log('comment deleted');return cb();});

}

exports.insertComment=function(data,cb)
{
   knex('comment_id').insert({
           // anounce_id: data.postid,
            comment:data.comment, 
            anounce_id: data.anounceid,
            user_id: data.userid,
            room_id: data.roomid,
           // likes:data.like
        }).then(function(){console.log('comment inserted');return cb();});

}
exports.updateComment=function(data,cb)
{
knex('comment_id')
.where('comment_id', data.id)
.update({
    comment:data.comment
//thisKeyIsSkipped: undefined
}).then(function(){console.log('comment updated');return cb();});

}
