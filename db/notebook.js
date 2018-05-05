//create db connection
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./WHITEBOARD.sqlite3"
    },

    useNullAsDefault: true
});

exports.insert=function (content,user_id,room_id,name)
{
    knex('notebook').insert(
        {
            content:content,user_id:user_id,room_id:room_id,name:name
        }
    )
        .then(function(res){
            console.log(res);
            //return cb(null,true);
        })


}
exports.getNotes=function (user_id,room_id,cb)
{
    console.log(user_id,room_id);
    knex('notebook').where({
        user_id: user_id,
        room_id: room_id
    }).select('*')
        .then(function(res)
        {

            return cb(null,res);
        });

}


/*exports.insert=function (content,userID)
{
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO notebook (content, user_id) VALUES ('"+content+"', '"+userID+"')";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
    con.end();
  });
 // con.end();
}
exports.getNotes=function(user_id)
{
  console.log("iam here in the function get")
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.end();
  });


}
*/



