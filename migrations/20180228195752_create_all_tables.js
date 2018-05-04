
exports.up = function(knex, Promise) {

    return knex.schema.createTable('user_login',function(table)
    {
        table.increments('user_id');
        table.string('username').notNullable();
        table.string('password_digest').notNullable();
        table.string('email').notNullable();
        table.boolean('student').notNullable();
        table.text('picture');
        table.timestamp('created_at');
        table.timestamp('updated_at');


    }).createTable('snapshots',function (table) {
        table.increments('id');
        table.binary('shot');
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');
        table.timestamp('created_at');
        table.timestamp('updated_at');


    }).createTable('room',function(table){
        table.increments('room_id');
        table.string('name');
        table.string('description');
        table.timestamp('created_at');
        table.timestamp('updated_at');

    }).createTable('room_members',function(table) {
        table.increments('id');
        table.integer('user_id').unsigned();
        table.integer('room_id').unsigned();
        table.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');
        table.foreign('room_id').references('room_id').inTable('room').onUpdate('cascade').onDelete('cascade');
        table.timestamp('created_at');
        table.timestamp('updated_at');

    }).createTable('board_history',function (table) {
        table.increments('id');
        table.binary('image').notNullable();
        table.integer('room_id').unsigned().notNullable();
        table.foreign('room_id').references('room_id').inTable('room').onUpdate('cascade').onDelete('cascade');

    });


};

exports.down = function(knex, Promise) {


    return knex.schema.dropTableIfExists('board_history')
        .dropTableIfExists('room_members')
        .dropTableIfExists('snapshots')
        .dropTableIfExists('room')
        .dropTableIfExists('user_login');
};
