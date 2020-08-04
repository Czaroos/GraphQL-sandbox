const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const typeDefs = gql`
  scalar Date

  type Post {
    id: ID!
    title: String!
    imageUrls: [String]
    text: String!
    likes: Int!
    shares: Int!
    comments: [Comment]
    thumbnailUrl: String
    created: Date!
  }

  type Comment {
    text: String!
    created: Date!
    user: User!
  }

  type User {
    name: String!
    email: String!
    role: Role!
  }

  enum Role {
    USER
    ADMIN
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type CreatePostMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    post(input: PostAndMediaInput): Post
  }

  input PostAndMediaInput {
    title: String
    text: String
    imagesUrls: [String]
  }
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
