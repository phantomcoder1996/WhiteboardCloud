var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./WHITEBOARD.sqlite3"
    },

    useNullAsDefault: true
});


var db=require('../db');
exports.getScreenshots=function(data,cb)
{
    var room_id=data.room_id;
    var user_id=data.user_id;
    console.log(room_id);


    knex('board_history')
        .where(function() {
            this.where('room_id', room_id).andWhere('user_id', user_id)
        })
        .then(

            function(MYscreenshots)
            {  console.log(MYscreenshots);
                if(!MYscreenshots) return cb(null,false);

                return cb(null,MYscreenshots);

            })

        .catch(
            function(err)
            {
                return cb(err);
            });

}

exports.saveScreenshot=function(data,cb)
{
    var room_id=data.room_id;
    var user_id=data.user_id;
    var image=data.image;
//    var room_id=1;
    var datetaken=data.datetaken;
    console.log(data);


    knex('board_history')
        .insert({user_id:user_id,room_id:room_id,image:image})
        .then(

            function(MYscreenshots)
            {  console.log(MYscreenshots);
                if(!MYscreenshots) return cb(null,false);

                return cb(null,MYscreenshots);

            })

        .catch(
            function(err)
            {
                console.log(err);
                return cb(err);

            });

}