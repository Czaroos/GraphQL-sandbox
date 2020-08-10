const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { createWriteStream, mkdir } = require('fs');
const db = require('./databaseConnection');
const knex = require('knex')({
  client: 'pg',
  conenction: {
    host: '192.168.1.49',
    user: 'postgresuser',
    database: 'graphql_sandbox',
    password: 'postgresuser',
    port: '5432',
  },
});
const posts = [
  {
    id: 1,
    title: 'tytul',
    text: 'tekst',
    createdAt: Date.now,
    tags: ['tag1', 'tag2'],
    comments: {
      postId: 1,
      text: 'text',
      createdAt: Date.now,
      user: {
        name: 'String! ',
        email: 'String!',
        role: 'USER',
      },
    },
    createdAt: Date.now,
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

const storeUpload = async ({ stream, filename, mimetype }) => {
  const path = `uploaded/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path, filename, mimetype }))
      .on('error', reject)
  );
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

const resolvers = {
  Query: {
    getPosts: () => knex('Post').select('*'),
    getPostById: (_, { id }) => posts.find((post) => post.id == id),
    getPostComments: (_, { postId }) =>
      comments.filter((comment) => comment.postId == postId),
    getBlogsIFollow: () => blogs,
    files: () => {
      // Return the record of files uploaded from your DB or API or filesystem.
    },
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

    uploadFile: async (_, { file }) => {
      mkdir('uploaded', { recursive: true }, (err) => {
        if (err) throw err;
      });
      const upload = await processUpload(file);
      return upload;
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
