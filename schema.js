const { gql } = require('apollo-server');
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
    tag: [Tag]
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

  type Tag {
    tag: String
  }

  type BlogsIFollow {
    url: String
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
    post(input: PostInput): Post
  }

  input PostInput {
    title: String
    text: String
    imagesUrls: [String]
  }

  type CreateCommentMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    comment(input: CommentInput): Comment
  }

  input CommentInput {
    title: String
    text: String
    imagesUrls: [String]
  }
`;

module.exports = typeDefs;
