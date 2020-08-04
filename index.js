const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    type Post {
      id: ID!
      Title: String
      Text: String
      Likes: Int
      Shares: Int
    }
  }
`;

const resolvers = {
  Query: {},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
