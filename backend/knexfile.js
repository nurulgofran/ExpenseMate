// Filepath: backend/knexfile.js
// Purpose: Provide Knex with DB connection settings for migrations and seeds.

const config = require('config');

const dbConfig = config.get('db');

module.exports = {
  development: {
    client: dbConfig.client,
    connection: dbConfig.connection,
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  },

  // You can add other environments (e.g., staging, production) if needed
};