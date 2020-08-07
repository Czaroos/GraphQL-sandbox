const { Client } = require('pg');

const client = new Client({
  user: 'postgresuser',
  host: '192.168.1.49',
  database: 'graphql_sandbox',
  password: 'postgresuser',
  port: 5432,
});

module.exports = client;
