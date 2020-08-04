const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Post {
    id: ID!
    title: String!
    images: [Images]
    text: String!
    likes: Int!
    shares: Int!
    comments: [Comment]
    thumbnail: Thumbnail
    created: Date!
  }
`;

const resolvers = {
  Query: {},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
