const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const db = require('./databaseConnection');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

db.connect((err) => {
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    console.log(`🚀  Database ready.`);
  }
});
