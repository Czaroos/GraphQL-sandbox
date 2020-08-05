const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Post {
    id: ID!
    title: String!
    text: String!
    comments: [Comment]
    createdAt: Date!
    tags: [Tag]
  }

  type Comment {
    postId: ID!
    text: String!
    createdAt: Date!
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

  type BlogIFollow {
    url: String
  }

  enum Role {
    USER
    ADMIN
  }

  type Query {
    getPosts: [Post]
    getPostById(id: ID!): Post
    getPostComments(postId: ID!): [Comment]
    getTags: [Tag]
    getBlogsIFollow: [BlogIFollow]
  }

  type Mutation {
    createPost(title: String!, text: String!, tags: [Tag]): Post
    createComment(postId: ID!, text: String!): Comment
    addTag(tag: String!): Tag
    addBlogIFollow(blogUrl: String!): BlogIFollow
  }
`;

module.exports = typeDefs;
