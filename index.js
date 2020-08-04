const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

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

  scalar Date
  type MyType {
    created: Date
  }
`;

const resolvers = {
  Query: {},
};
const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};



const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
