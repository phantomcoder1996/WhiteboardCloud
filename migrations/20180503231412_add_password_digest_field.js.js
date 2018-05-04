
exports.up = function(knex, Promise) {

   //  return knex.schema.table('user_login', function(t) {
   //     t.string('password_digest').notNullable();
   // });
};

exports.down = function(knex, Promise) {

     // return knex.schema.table('user_login', function(t) {
     // t.dropColumn('password_digest');
// });
};
