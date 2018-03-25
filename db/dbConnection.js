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


module.exports=knex;