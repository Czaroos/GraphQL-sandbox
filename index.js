const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { client } = require('./databaseConnection');
const { getUser } = require('./models/User');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
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

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`)
);

client.connect((err) => {
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    console.log(`🚀  Database ready.`);
  }
});
