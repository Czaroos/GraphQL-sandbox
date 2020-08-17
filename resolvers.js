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
      { title, text, tags, isTesting = false, file },
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
      let uploadedFile = null;
      let res = null;

      if (file) {
        uploadedFile = await uploadFile(_, { file, isTesting });
        const values = [
          title,
          text,
          dateString,
          userId,
          capitalizedTags,
          uploadedFile.path || null,
        ];
        res = await setTransaction(
          'INSERT INTO "Post" (title, text, "createdAt", "userId", "tags", "imageUrl") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          values,
          isTesting
        );
      } else {
        const values = [title, text, dateString, userId, capitalizedTags];
        res = await setTransaction(
          'INSERT INTO "Post" (title, text, "createdAt", "userId", "tags") VALUES ($1, $2, $3, $4, $5) RETURNING *',
          values,
          isTesting
        );
      }

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
    deletePostById: async (_, { id, isTesting = false }) => {
      const res = await setTransaction(
        `DELETE FROM "Post" WHERE "id"=${id} RETURNING *`,
        _,
        isTesting
      );
      return res[0];
    },
    deleteCommentById: async (_, { id, isTesting = false }) => {
      const res = await setTransaction(
        `DELETE FROM "Comment" WHERE "id"=${id} RETURNING *`,
        _,
        isTesting
      );
      return res[0];
    },
    uploadFile: async (_, { file, isTesting = false }) =>
      await uploadFile(_, { file, isTesting }),

    createComment: async (_, { postId, text, user, isTesting = false }) => {
      const dateString = dateToString(new Date());
      const values = [postId, text, user, dateString];

      const test = await setTransaction(
        'INSERT INTO "Comment" ("postId", text, "user", "createdAt") VALUES ($1, $2, $3, $4) RETURNING *',
        values,
        isTesting
      );
      return test[0];
    },
    updateComment: async (_, { text, id, isTesting = false }) => {
      const test = await setTransaction(
        `UPDATE "Comment" SET text='${text}'  WHERE id='${id}' RETURNING *`,
        isTesting
      );
      return test[0];
    },
    updatePost: async (
      _,
      { title, id, text, tags, file, isTesting = false }
    ) => {
      if (tags && file) {
        uploadedFile = await uploadFile(_, { file, isTesting });
        const test = await setTransaction(
          `UPDATE "Post" SET title='${title}', "text"='${text}', "tags"='{${tags}}', "imageUrl"='${uploadedFile.path}'  WHERE id='${id}' RETURNING *`,
          console.log(uploadedFile.path),
          isTesting
        );
        const capitalizedTags = tags.map((tag) =>
          tag.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
        );
        const tagRes = await Promise.all(
          capitalizedTags.map(async (tag) => {
            try {
              return await addTag(tag);
            } catch (err) {
              throw err;
            }
          })
        );
        tags = tagRes.map((tag) => {
          return tag[0].tag;
        });
        return test[0];
      }
      if (file) {
        uploadedFile = await uploadFile(_, { file, isTesting });
        const test = await setTransaction(
          `UPDATE "Post" SET title='${title}', "text"='${text}', "imageUrl"='${uploadedFile.path}'  WHERE id='${id}' RETURNING *`,
          isTesting
        );
        return test[0];
      }
      if (tags) {
        const test = await setTransaction(
          `UPDATE "Post" SET title='${title}', "text"='${text}', "tags"='{${tags}}'  WHERE id='${id}' RETURNING *`,
          isTesting
        );
        const capitalizedTags = tags.map((tag) =>
          tag.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
        );
        const tagRes = await Promise.all(
          capitalizedTags.map(async (tag) => {
            try {
              return await addTag(tag);
            } catch (err) {
              throw err;
            }
          })
        );
        tags = tagRes.map((tag) => {
          return tag[0].tag;
        });
        return test[0];
      } else {
        const test = await setTransaction(
          `UPDATE "Post" SET title='${title}', "text"='${text}'  WHERE id='${id}' RETURNING *`,
          isTesting
        );
        return test[0];
      }
    },
    logIn: async (_, { email, password }, context) =>
      await logInUser(email, password),
  },
};

module.exports = resolvers;
