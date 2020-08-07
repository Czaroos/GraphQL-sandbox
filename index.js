const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const db = require('./databaseConnection');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  db.connect();
  console.log(`🚀  Database ready.`);
  console.log(`🚀  Server ready at ${url}`);
  db.end();
});
