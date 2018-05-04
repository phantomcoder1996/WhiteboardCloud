
exports.up = function(knex, Promise) {
    return knex.schema.dropTableIfExists('board_history');
};

exports.down = function(knex, Promise) {

};
