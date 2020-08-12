const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { client } = require('./databaseConnection');
const User = require('./models/User');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = User.getUser(token);
    return { user };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

client.connect((err) => {
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    console.log(`🚀  Database ready.`);
  }
});
