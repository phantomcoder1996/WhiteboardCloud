
exports.up = function(knex, Promise) {

    return knex.schema.createTable('notebook',function (table) {
        table.increments('id');
        table.integer('user_id').notNullable();
        table.integer('room_id').unsigned().notNullable();
        table.foreign('room_id').references('room_id').inTable('room').onUpdate('cascade').onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('notebook');
};
