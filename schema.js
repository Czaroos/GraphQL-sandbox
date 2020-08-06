const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Post {
    id: ID!
    title: String!
    text: String!
    comments: [Comment]
    createdAt: Date!
    tags: [String]
    pictures: Picture
  }

  type Comment {
    postId: ID!
    text: String!
    createdAt: Date!
    user: User!
  }
  type Picture {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type User {
    name: String!
    email: String!
    role: Role!
  }

  type BlogIFollow {
    url: String
  }

  enum Role {
    USER
    ADMIN
  }

  type File {
    filename: String!
    mimetype: String!
    path: String!
  }

  type Query {
    getPosts: [Post]
    getPostById(id: ID!): Post
    getPostComments(postId: ID!): [Comment]
    getBlogsIFollow: [BlogIFollow]
    files: [File!]
  }

  type Mutation {
    createPost(
      title: String!
      text: String!
      tags: [String]
      pictures: Upload!
    ): Post
    createComment(postId: ID!, text: String!): Comment
    uploadFile(file: Upload!): File!
  }
`;

module.exports = typeDefs;
