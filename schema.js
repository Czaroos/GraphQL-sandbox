const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    text: String!
    comments: [Comment]
    createdAt: String!
    tags: [String]
    userId: ID!
  }

  type Tag {
    id: ID!
    tag: String
    weight: Int
  }

  type Comment {
    id: ID!
    postId: ID!
    text: String!
    createdAt: String!
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
    getPostsByDate(month: String, year: String): [Post]
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
    deletePostById(id: ID!): Post
    deleteCommentById(id: ID!): Comment
    uploadFile(file: Upload!, postId: ID!, isTesting: Boolean): File!
    logIn(email: String!, password: String!): User
  }
`;

module.exports = typeDefs;
