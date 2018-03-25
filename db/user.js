// var knex=require('./dbConnection.js');
var bcrypt=require('bcrypt');
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

exports.findByUserName=function(username,cb) {
    console.log(username);
    knex.select().from('user_login').where('username',username)
        .then(function(user){
            console.log(user[0]);
            if(user[0])return cb(null,user);
            return cb(null,false);
        } );

}

exports.findById=function(id,cb)
{
    knex.select().from('user_login').where('user_id',id)
        .then(function(user){
            console.log(user[0]+" from findByUd");

            if(user) return cb(null,user[0]);
            else return cb(null,false);
        })
}


exports.addUser=function(req,cb) {
    console.log(req.body);
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err){console.log(err); return cb(err);}
        else {

            console.log(hash);

            knex('user_login').insert({
                username: req.body.username,
                password_digest: hash,
                email: req.body.email,
                student: req.body.role
            }).then(function(){console.log('user inserted');return cb();});

            // knex('user_login').insert({username:req.body.username,password:req.body.password_digest,email:req.body.email,role:req.body.role})
            //     .then(function(){console.log('user successfully added')});
        }
    });
}