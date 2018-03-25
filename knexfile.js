// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
        database: 'WHITEBOARD',
        user:     'root',
        password: ''
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'WHITEBOARD',
      user:     'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',                      // 'postgresql',
    connection: {
        database: 'localhost//WHITEBOARD',
      user:     'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
