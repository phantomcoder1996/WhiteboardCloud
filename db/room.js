//var knex=require('./dbConnection');

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


exports.getRooms=function(cb)
{
 knex.select('room_id','name').from('room')
.then(function(room){
//console.log(room);



return cb(null,room);
}
).catch( function(err)
{
return cb(err);
console.log(err);
console.log('handled error');

}
);

}
exports.createRoom=function(req,cb)
{
var name=req.body.name;

knex('room').insert({name:name}).then(function(room){ console.log(room);})
}

exports.findRoomID=function(name)
{
knex.select('room_id').from('room').then(function(room){console.log(room);})
}


exports.addMemberToRoom=function(data)
{
var username=data.username;
var roomid=data.roomid;

var userid;
db.user.findByUserName(username,function(err,user)
{
if(err) throw err;
userid=user[0].user_id;
console.log(userid+" from function add member to room");
knex('room_members').insert({user_id:userid,room_id:roomid}).then(function(){console.log('user '+username+' was added to room '+ roomid);});
}
);


}
