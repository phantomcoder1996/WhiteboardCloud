
exports.up = function(knex, Promise) {
    return knex.schema.createTable('Posts',function(table)
    {
        table.increments('post_id');
        table.string('post').notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');



    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('Posts');

};
