const config = require('config');
const knex = require('knex');

const dbConfig = config.get('db');
const db = knex(dbConfig);

module.exports = db;