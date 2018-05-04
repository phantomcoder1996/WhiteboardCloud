//var knex=require('./dbConnection');

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./WHITEBOARD.sqlite3"
    },

        useNullAsDefault: true
});

var db=require('../db');
var bcrypt=require('bcrypt');

exports.getRooms=function(cb)
{
 knex.select('room_id','name','description').from('room')
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
var description=data.description;

knex.select('name').from('room').where('name',name).then(function(roomname){console.log(roomname+" from createroomdb");
if(roomname[0]) {console.log("existing room");return cb(null,false);}
else
{
knex('room').insert({name:name,password:password,description:description}).then(function(room){ console.log(room);return cb(null,true);}).catch(function(err) {return cb(err);});
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

console.log(userpassword+"from addMemberToRoom");
                 bcrypt.compare(password,userpassword[0].password,function(err,res)
                 {

                     if(err) return cb(err);
                     if(res){console.log('success');
                     //insert the user into the room
                     knex('room_members').insert({user_id:userid,room_id:roomid}).then(function(){console.log("user is inserted")}).catch(function(err){if(err) {
                     console.log(err);
                     console.log("user was inserted before");}});
                     return cb(null,true);
                     //true means that the password is correct

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

console.log("isMemberofRoom" +data);
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
{
console.log(roomids[i]);
return cb(null,true);
}

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
knex('room_members').join('room','room_members.room_id','=','room.room_id').select('room.room_id','room.name','room.description').where('room_members.user_id',userid)
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

exports.getRoomPassword=function(roomid,cb)
{
console.log(roomid+"password");
   knex.select('password').from('room').where('room_id',roomid).then(function(roompassword)
{
    if(!roompassword) return cb(null,false);

    console.log(roompassword+" from db.room.getpassword");
    return cb(null,roompassword[0]);

}


).catch(function(err){ return cb(err); });


}




exports.doesRoomExist=function(roomid,cb)
{
   knex.select('name').from('room').where('room_id',roomid).then(function(roomid)
{
    if(!roomid[0]) return cb(null,false);

    console.log(roomid[0]+" from db.room.doesroomexist");
    return cb(null,true);

}


).catch(function(err){ return cb(err); });


}


exports.removeMemberFromRoom=function(roomid,userid)
{


knex('room_members').where('room_id',roomid).where('user_id',userid).del().catch(function(err){if(err) console.log("unable to remove user");});

}

