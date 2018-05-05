
exports.up = function(knex, Promise) {

    return knex.schema.table('Comments', function(t) {
        t.text('commenter_picture');
        t.text('commenter_name');
        
    });
  
};

exports.down = function(knex, Promise) {

    return knex.schema.table('Comments', function(t) {
        t.dropColumn('commenter_picture');
        t.dropColumn('commenter_name');
    });
  
};
