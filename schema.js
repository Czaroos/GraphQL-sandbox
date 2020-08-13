const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Post {
    id: ID!
    title: String!
    text: String!
    comments: [Comment]
    createdAt: Date
    tags: [String]
    userId: ID!
  }

  type Comment {
    postId: ID!
    text: String!
    createdAt: Date!
    user: String!
  }

  type User {
    name: String!
    email: String!
    password: String!
    userId: ID!
    token: String!
  }

  type BlogIFollow {
    url: String
  }

  type File {
    filename: String!
    mimetype: String!
    path: String!
    postId: ID!
  }

  type Query {
    getPosts: [Post]
    getPostById(id: ID!): Post
    getPostComments(postId: ID!): [Comment]
    getBlogsIFollow: [BlogIFollow]
    files: [File!]
    getPostByTags(tags: [String!]): [Post]
  }

  type Mutation {
    createPost(
      title: String!
      text: String!
      tags: [String]
      isTesting: Boolean
    ): Post
    createComment(
      postId: ID!
      text: String!
      user: String!
      isTesting: Boolean
    ): Comment
    uploadFile(file: Upload!, postId: ID!, isTesting: Boolean): File!
    logIn(email: String!, password: String!): User
  }
`;

module.exports = typeDefs;
