
exports.up = function(knex, Promise) {

    return knex.schema.createTable('annoncments',function(table)
    {
        table.increments('anounce_id');
        table.string('anounce').notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');
        table.integer('room_id').unsigned().notNullable();
        table.foreign('room_id').references('room_id').inTable('room').onUpdate('cascade').onDelete('cascade');
    });

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('annoncments');
};
