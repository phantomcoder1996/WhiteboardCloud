
exports.up = function(knex, Promise) {

    return knex.schema.table('board_history', function(t) {
        t.foreign('user_id').references('user_id').inTable('user_login').onUpdate('cascade').onDelete('cascade');
});

};

exports.down = function(knex, Promise) {

    return knex.schema.table('room', function(t) {
     t.dropColumn('user_id');
 });
};
