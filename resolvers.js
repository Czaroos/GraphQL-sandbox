const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { setQuery, setTransaction } = require('./utils/queries');
const { getFiles, uploadFile } = require('./utils/upload');
const { AuthenticationError } = require('apollo-server');
const { logInUser } = require('./models/User');
const { addTag } = require('./models/Tag');
const { dateToString } = require('./utils/date');

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
    getPostByTags: async (_, { tags }) => {
      const res = await setQuery(
        `SELECT * FROM "Post" AS t
        WHERE (
            SELECT true 
            FROM unnest(t.tags) AS n
            WHERE n ILIKE '${tags}'
            LIMIT 1
        );`
      );
      return res;
    },
    getBlogsIFollow: async () => {
      const res = await setQuery(`SELECT * FROM "BlogIFollow"`);
      return res;
    },
    files: async () => await getFiles(),
    getPostsByDate: async (_, { month, year }) => {
      const res = await setQuery(
        `SELECT * FROM "Post" WHERE "createdAt" LIKE '%${month}-${year}'`
      );
      return res;
    },
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
      const dateString = dateToString(new Date());
      const userId = user.userId;
      const capitalizedTags = tags.map((tag) =>
        tag.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
      );
      const values = [title, text, dateString, userId, capitalizedTags];

      const res = await setTransaction(
        'INSERT INTO "Post" (title, text, "createdAt", "userId", "tags") VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values,
        isTesting
      );

      // add tag to db or increment its weight
      const tagRes = await Promise.all(
        capitalizedTags.map(async (tag) => {
          try {
            return await addTag(tag);
          } catch (err) {
            throw err;
          }
        })
      );

      // return tag name only
      tags = tagRes.map((tag) => {
        return tag[0].tag;
      });

      return { ...res[0], tags };
    },
    deletePostById: async (_, { id }) => {
      const res = await setQuery(
        `DELETE FROM "Post" WHERE "id" =${id}RETURNING *`
      );
      return res[0];
    },
    deleteCommentById: async (_, { id }) => {
      const res = await setQuery(
        `DELETE FROM "Comment" WHERE "id" =${id}RETURNING *`
      );
      return res[0];
    },
    uploadFile: async (_, { file, postId, isTesting = false }) =>
      await uploadFile(_, { file, postId, isTesting }),

    createComment: async (_, { postId, text, user, isTesting = false }) => {
      const dateString = dateToString(new Date());
      const values = [postId, text, user, dateString];

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
};

module.exports = resolvers;
