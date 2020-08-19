const { ApolloServer } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { client } = require('./databaseConnection');
const { getUser } = require('./models/User');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      const token = req.headers.authorization || '';
      if (token !== '') {
        const user = await getUser(token);
        return { user, pubsub };
      }
    }
    return { pubsub };
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
