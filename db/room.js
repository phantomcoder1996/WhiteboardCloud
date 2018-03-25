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
var bcrypt=require('bcrypt');

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
exports.createRoom=function(data,cb)
{
console.log(data);
var name=data.roomname;
var password=data.password;

knex.select('name').from('room').where('name',name).then(function(roomname){console.log(roomname+" from createroomdb");
if(roomname!=null) {console.log("nullroom");return cb(null,false);}
else
{
knex('room').insert({name:name,password:password}).then(function(room){ console.log(room);return cb(null,true);}).catch(function(err) {return cb(err);});
}
}).catch(function(err){if(err) throw err;})



}

exports.findRoomID=function(name)
{
knex.select('room_id').from('room').then(function(room){console.log(room);})
}


exports.addMemberToRoom=function(data,cb)
{
var userid=data.userid;
var roomid=data.roomid;
var password=data.password;

knex.select('password').from('room').where('room_id',roomid).then(

function(userpassword)
{
                 bcrypt.compare(password,userpassword[0].password,function(err,res)
                 {

                     if(err) return cb(err);
                     if(res){console.log('success');
                     //insert the user into the room
                     knex('room_members').insert({user_id:userid,room_id:roomid}).then(function(){console.log('user '+username+' was added to room '+ roomid);});
                     return cb(null,true);

                     }
                     else
                     {console.log('not success');
                         return cb(null,false);}
                 }


)
}
)
.catch(
function(err)
{
return cb(err);

}

);

}
/*db.user.findByUserName(username,function(err,user)
{
if(err) throw err;
userid=user[0].user_id;
console.log(userid+" from function add member to room");
knex('room_members').insert({user_id:userid,room_id:roomid}).then(function(){console.log('user '+username+' was added to room '+ roomid);});
}*/
//);



//}


exports.getRoomIdByName=function(roomname,cb)
{
knex.select('room_id').from('room').where('name',roomname).then(function(room_id)
{
if(!room_id) return cb(null,false);
return cb(null,room_id);
})
.catch(function(err)
{
return cb(err);
}
);
}

exports.getRoomNameById=function(roomid,cb)
{

knex.select('name').from('room').where('room_id',roomid).then(

function(name)
{
var name=name[0].name;
if(!name) return cb(null,false);

return cb(null,name);
}
)
.catch(function(err){return cb(err);});

}
exports.ifRoomExists=function(roomid,cb)
{

knex.select('room_id').from('room').where('room_id',roomid)
.then(
function(mroomid){
console.log(mroomid+" from ifRoomExists");
if(mroomid==""){
console.log('Room does not exist');
return cb(null,false);}
else {
console.log("exists from db");
return cb(null,true);}

}
)
.catch(function(err){if(err){return cb(err);}});
}


exports.isMemberOfRoom=function(data,cb)
{

var userid=data.user_id;
var roomid=data.room_id;

knex.select('room_id').from('room_members').where('user_id',userid)
.then(

function(roomids)
{
if(!roomids) return cb(null,false);

for(var i=0;i<roomids.length;i++)
{
if(roomids[i].room_id==roomid)//user is a member of that room
return cb(null,true);

}

return cb(null,false);

}

).catch
(
function(err)
{
if(err) return cb(err);
}
);

}


exports.getAllUserRooms=function(userid,cb)
{
knex('room_members').join('room','room_members.room_id','=','room.room_id').select('room.room_id','room.name').where('room_members.user_id',userid)
.then(

function(rooms)
{
if(!rooms) return cb(null,false);

return cb(null,rooms);

})

.catch(
function(err)
{
return cb(err);
});

}

