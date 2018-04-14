
exports.up = function(knex, Promise) {
    return knex.schema.createTable('Comments',function(table)
    {
        table.increments('comment_id');
        table.text('comment').notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');
        table.integer('room_id').unsigned().notNullable();
        table.foreign('room_id').references('room_id').inTable('room').onUpdate('cascade').onDelete('cascade');
        table.integer('anounce_id').unsigned().notNullable();
        table.foreign('anounce_id').references('anounce_id').inTable('annoncments').onUpdate('cascade').onDelete('cascade');
    });
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('Comments');
  
};
