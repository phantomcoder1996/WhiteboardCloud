
exports.up = function(knex, Promise) {

    knex.schema.alterTable('user_login', function(t) {
        t.unique('username');
    })
};

exports.down = function(knex, Promise) {

    knex.schema.dropUnique('username');
};
