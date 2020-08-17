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
    imageUrl: String
  }

  type Tag {
    id: ID!
    tag: String
    weight: Int
  }

  type Comment {
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
  }

  type Query {
    getPosts: [Post]
    getPostById(id: ID!): Post
    deletePostById(id: ID!): Post
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
      file: Upload
    ): Post
    createComment(
      postId: ID!
      text: String!
      user: String!
      isTesting: Boolean
    ): Comment
    uploadFile(file: Upload!, isTesting: Boolean): File!
    logIn(email: String!, password: String!): User
  }
`;

module.exports = typeDefs;
