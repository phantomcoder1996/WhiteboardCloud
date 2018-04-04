
exports.up = function(knex, Promise) {

   return knex.schema.alterTable('room', function(t) {
        t.unique('name');
    }).alterTable('room_members',function(t)
    {
        t.unique(['user_id','room_id']);
    });
};

exports.down = function(knex, Promise) {

   return knex.schema.dropUnique('username')
              .dropUnique(['user_id','room_id']);
};
