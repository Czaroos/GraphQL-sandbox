const { setTransaction } = require('./utils/dbqueries');
const { uploadFile } = require('./utils/upload');
const { AuthenticationError } = require('apollo-server');
const { logInUser } = require('./models/User');
const { addTag } = require('./models/Tag');
const { dateToString } = require('./utils/date');

const Mutation = {
  createPost: async (
    _,
    { title, text, tags, isTesting = false, file },
    { user, pubsub }
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
      [res] = await setTransaction(
        'INSERT INTO "Post" (title, text, "createdAt", "userId", "tags", "imageUrl") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values,
        isTesting
      );
    } else {
      const values = [title, text, dateString, userId, capitalizedTags];
      [res] = await setTransaction(
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

    pubsub.publish(`post`, {
      post: { mutation: 'CREATED', data: { ...res, tags } },
    });
    console.log({ ...res, tags });
    return { ...res, tags };
  },
  deletePostById: async (_, { id, isTesting = false }, pubsub) => {
    const [res] = await setTransaction(
      `DELETE FROM "Post" WHERE "id"=${id} RETURNING *`,
      _,
      isTesting
    );
    pubsub.publish(`post`, {
      post: {
        mutation: 'DELETED',
        data: res,
      },
    });
    return res;
  },
  deleteCommentById: async (_, { id, isTesting = false }, pubsub) => {
    const [res] = await setTransaction(
      `DELETE FROM "Comment" WHERE "id"=${id} RETURNING *`,
      _,
      isTesting
    );
    pubsub.publish(`comment ${res.postId}`, {
      comment: {
        mutation: 'DELETED',
        data: res,
      },
    });
    return res;
  },
  uploadFile: async (_, { file, isTesting = false }) =>
    await uploadFile(_, { file, isTesting }),

  createComment: async (
    _,
    { postId, text, user, isTesting = false },
    pubsub
  ) => {
    const dateString = dateToString(new Date());
    const values = [postId, text, user, dateString];

    const [res] = await setTransaction(
      'INSERT INTO "Comment" ("postId", text, "user", "createdAt") VALUES ($1, $2, $3, $4) RETURNING *',
      values,
      isTesting
    );

    pubsub.publish(`comment ${postId}`, {
      comment: {
        mutation: 'CREATED',
        data: res,
      },
    });

    return res;
  },
  updateComment: async (_, { text, id, isTesting = false }, pubsub) => {
    const [res] = await setTransaction(
      `UPDATE "Comment" SET text='${text}'  WHERE id='${id}' RETURNING *`,
      _,
      isTesting
    );
    pubsub.publish(`comment ${res.postId}`, {
      comment: {
        mutation: 'UPDATED',
        data: res,
      },
    });
    return res;
  },
  updatePost: async (
    _,
    { title, id, text, tags, file, isTesting = false },
    pubsub
  ) => {
    if (tags && file) {
      uploadedFile = await uploadFile(_, { file, isTesting });
      const [res] = await setTransaction(
        `UPDATE "Post" SET title='${title}', "text"='${text}', "tags"='{${tags}}', "imageUrl"='${uploadedFile.path}'  WHERE id='${id}' RETURNING *`,
        _,
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
      pubsub.publish(`post`, {
        post: {
          mutation: 'UPDATED',
          data: { ...res, tags },
        },
      });
      return { ...res, tags };
    }
    if (file) {
      uploadedFile = await uploadFile(_, { file, isTesting });
      const [res] = await setTransaction(
        `UPDATE "Post" SET title='${title}', "text"='${text}', "imageUrl"='${uploadedFile.path}'  WHERE id='${id}' RETURNING *`,
        _,
        isTesting
      );
      pubsub.publish(`post`, {
        post: {
          mutation: 'UPDATED',
          data: { ...res, tags },
        },
      });
      return { ...res, tags };
    }
    if (tags) {
      const [res] = await setTransaction(
        `UPDATE "Post" SET title='${title}', "text"='${text}', "tags"='{${tags}}'  WHERE id='${id}' RETURNING *`,
        _,
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
      pubsub.publish(`post`, {
        post: {
          mutation: 'UPDATED',
          data: { ...res, tags },
        },
      });
      return { ...res, tags };
    } else {
      const [res] = await setTransaction(
        `UPDATE "Post" SET title='${title}', "text"='${text}'  WHERE id='${id}' RETURNING *`,
        _,
        isTesting
      );
      pubsub.publish(`post`, {
        post: {
          mutation: 'UPDATED',
          data: { ...res, tags },
        },
      });
      return { ...res, tags };
    }
  },
  logIn: async (_, { email, password }) => await logInUser(email, password),
};

module.exports = Mutation;
