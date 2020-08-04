const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Post {
    id: ID!
    title: String!
    images: [Image]
    text: String!
    likes: Int!
    shares: Int!
    comments: [Comment]
    thumbnail: Image
    created: Date!
  }

  type Image {
    link: String
    alt: String
  }

  type Comment {
    text: String
    created: Date
    user: User
  }

  type User {
    name: String
    email: String
    role: Role
  }

  enum Role {
    USER
    ADMIN
  }
`;

const resolvers = {
  Query: {},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
