
exports.up = function(knex, Promise) {

  /*  return knex.schema.createTable('user_login',function(table)
    {
        table.increments('user_id');
        table.string('username').notNullable();
        table.string('password_digest').notNullable();
        table.string('email').notNullable();
        table.boolean('student').notNullable().defaultTo(1);
        table.text('picture');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());


    }).createTable('snapshots',function (table) {
        table.increments('id');
        table.string('shot').notNullable();
        table.integer('user_id').notNullable();
        table.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());


    }).createTable('room',function(table){
        table.increments('room_id');
        table.string('name').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable('room_members',function(table) {
        table.increments('id');
        table.integer('user_id').notNullable();
        table.integer('room_id').notNullable();
        table.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');
        table.foreign('room_id').references('room_id').inTable('room').onUpdate('cascade').onDelete('cascade');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    }).createTable('board_history',function (table) {
        table.increments('id');
        table.text('image');
        table.integer('room_id').notNullable();
        table.foreign('room_id').references('room_id').inTable('room').onUpdate('cascade').onDelete('cascade');

    });*/


};

exports.down = function(knex, Promise) {


 /*   return knex.schema.dropTable('board_history')
        .dropTable('room_members')
        .dropTable('snapshots')
        .dropTable('room')
        .dropTable('user_login');*/
};
