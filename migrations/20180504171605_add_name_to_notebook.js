
exports.up = function(knex, Promise) {

    return knex.schema.table('notebook', function(t) {
        t.string('name');
    });
};

exports.down = function(knex, Promise) {

    return knex.schema.table('notebook', function(t) {
    t.dropColumn('name');});
};
