const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    type Launch {
      id: ID!
      site: String
      mission: Mission
      rocket: Rocket
      isBooked: Boolean!
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
