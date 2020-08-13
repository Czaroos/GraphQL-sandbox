const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { setQuery, setTransaction } = require('./utils/queries');
const { getFiles, uploadFile } = require('./utils/upload');
const { AuthenticationError } = require('apollo-server');
const { logInUser } = require('./models/User');

const resolvers = {
  Query: {
    getPosts: async () => {
      const res = await setQuery('SELECT * FROM "Post"');
      return res;
    },
    getPostById: async (_, { id }) => {
      const res = await setQuery(`SELECT * FROM "Post" WHERE id=${id}`);
      return res[0];
    },
    getPostComments: async (_, { postId }) => {
      const res = await setQuery(
        `SELECT * FROM "Comment" WHERE "postId"=${postId}`
      );
      return res;
    },
    getBlogsIFollow: async () => {
      const res = await setQuery(`SELECT * FROM "BlogIFollow"`);
      return res;
    },
    files: async () => await getFiles(),
  },

  Mutation: {
    createPost: async (
      _,
      { title, text, tags, isTesting = false },
      { user }
    ) => {
      if (!user)
        return new AuthenticationError(
          'You must be logged in to perform createPost action!'
        );
      const createdAt = new Date();
      const userId = user.userId;
      const values = [title, text, tags, createdAt, userId];

      const res = await setTransaction(
        'INSERT INTO "Post" (title, text, tags, "createdAt", "userId") VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values,
        isTesting
      );
      return res[0];
    },

    uploadFile: async (_, { file, postId, isTesting = false }) =>
      await uploadFile(_, { file, postId, isTesting }),

    createComment: async (_, { postId, text, user, isTesting = false }) => {
      const createdat = new Date();
      const values = [postId, text, user, createdat];

      const test = await setTransaction(
        'INSERT INTO "Comment" ("postId", text, "user", "createdat") VALUES ($1, $2, $3, $4) RETURNING *',
        values,
        isTesting
      );
      return test[0];
    },

    logIn: async (_, { email, password }, context) =>
      await logInUser(email, password),
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
