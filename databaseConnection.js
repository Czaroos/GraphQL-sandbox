const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'postgresuser',
  host: '192.168.1.49',
  database: 'graphql_sandbox',
  password: 'postgresuser',
  port: 5432,
});
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});
const client = new Client({
  user: 'postgresuser',
  host: '192.168.1.49',
  database: 'graphql_sandbox',
  password: 'postgresuser',
  port: 5432,
});
client.connect();
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  client.end();
});
module.exports = databaseConnection;
