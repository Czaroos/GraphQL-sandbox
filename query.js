const { getFiles } = require('./utils/upload');
const { setQuery } = require('./utils/dbqueries');

const Query = {
  getPosts: async () => {
    const res = await setQuery('SELECT * FROM "Post"');
    return res;
  },
  getPostById: async (_, { id }) => {
    const [res] = await setQuery(`SELECT * FROM "Post" WHERE id=${id}`);
    return res;
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
};

module.exports = Query;
