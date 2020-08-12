const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { client } = require('./databaseConnection');
const { getUser } = require('./models/User');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    // console.log(token);
    // const body = req.body;
    const user = getUser(token);
    // return { user, body };
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
