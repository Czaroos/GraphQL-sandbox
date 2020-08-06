const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const posts = [
  {
    id: 1,
    title: 'tytul',
    text: 'tekst',
    createdAt: Date.now,
    tags: ['tag1', 'tag2'],
  },
  {
    id: 2,
    title: 'tytul2',
    text: 'tekst2',
    createdAt: Date.now,
    tags: ['tag2', 'tag3'],
  },
];

const comments = [
  {
    postId: 1,
    text: 'text',
    createdAt: Date.now,
    user: {
      name: 'String!',
      email: 'String!',
      role: 'USER',
    },
  },
  {
    postId: 2,
    text: 'text2',
    createdAt: Date.now,
    user: [],
  },
  {
    postId: 1,
    text: 'text3',
    createdAt: Date.now,
    user: [],
  },
];

const blogs = [
  {
    url: 'https:/fdsfsdf',
  },
  {
    url: 'https://aaaaaaaa.com',
  },
];

const resolvers = {
  Query: {
    getPosts: () => posts,
    getPostById: (_, { id }) => posts.find((post) => post.id == id),
    getPostComments: (_, { postId }) =>
      comments.filter((comment) => comment.postId == postId),
    getBlogsIFollow: () => blogs,
  },

  Mutation: {
    createPost: (_, { title, text, tags }) => {
      const newPost = {
        id: 3,
        title,
        text,
        comments: [],
        tags,
        createdAt: Date.now(),
      };

      return newPost;
    },

    createComment: (_, { postId, text }) => {
      const newComment = {
        postId,
        text,
      };
      return newComment;
    },
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return new Date(value).toDateString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

module.exports = resolvers;
