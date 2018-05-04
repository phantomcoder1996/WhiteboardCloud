
exports.up = function(knex, Promise) {

    return knex.schema.table('user_login', function(t) {
        t.dropColumn('picture');});
};

exports.down = function(knex, Promise) {
  
};
