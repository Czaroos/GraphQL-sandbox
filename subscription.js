const { setQuery } = require('./utils/dbqueries');

const Subscription = {
  comment: {
    subscribe: async (_, { postId }, { pubsub }) => {
      const post = await setQuery(`SELECT * FROM "Post" WHERE id=${postId}`);
      if (!post || post === []) {
        throw new Error('Post not found');
      }
      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe: async (_, __, { pubsub }) => {
      return pubsub.asyncIterator(`post`);
    },
  },
};

module.exports = Subscription;
