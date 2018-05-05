exports.up = function(knex, Promise) {

    return knex.schema.alterTable('user_login', function(t) {
        t.unique('username');
    });
};

exports.down = function(knex, Promise) {

    return knex.schema.dropUnique('username');

};
