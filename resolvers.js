const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { createWriteStream, mkdir, readdirSync } = require('fs');
const { client, pool } = require('./databaseConnection');
const path = require('path');
const uploadedDirPath = path.join(__dirname, 'uploaded');
const mime = require('mime');

const setQuery = async (queryString, values) => {
  const res = await pool.connect().then((client) => {
    return client
      .query(queryString, values)
      .then((res) => {
        client.release();
        return res;
      })
      .catch((err) => {
        client.release();
        console.log(err);
      });
  });
  console.log(res.rows);
  return res.rows;
};

const setTransaction = async (queryString, values, isTesting) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query(queryString, values);

    if (isTesting) {
      await client.query('ROLLBACK');
      console.log('test passed');
      return res.rows;
    } else {
      await client.query('COMMIT');
      return res.rows;
    }
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();

  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

const storeUpload = async ({ stream, filename, mimetype }) => {
  const path = `uploaded/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path, filename, mimetype }))
      .on('error', reject)
  );
};
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
    files: async () => {
      const files = await readdirSync(uploadedDirPath);
      return files.map((file) => {
        return {
          filename: file,
          mimetype: mime.getType(file),
          path: `uploaded/${file}`,
        };
      });
    },
  },

  Mutation: {
    createPost: async (
      _,
      { title, text, tags, isTesting = false, imageurl }
    ) => {
      const createdAt = new Date();
      const values = [title, text, tags, createdAt, imageurl];

      const res = await setTransaction(
        'INSERT INTO "Post" (title, text, tags, "createdAt", imageurl) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values,
        isTesting
      );
      console.log(res[0]);
      return res[0];
    },

    uploadFile: async (_, { file, PostId, filename }) => {
      mkdir('uploaded', { recursive: true }, (err) => {
        if (err) throw err;
      });
      await file.then((file) => (filename = file.filename));
      // const path = await filename;
      const url = `uploaded/${filename}`;
      const values = [PostId, url];
      console.log(file, filename);
      const res = await setQuery(
        'INSERT INTO "Image"("PostId", "url") VALUES ($1,$2)RETURNING *',
        values
      );

      const upload = await processUpload(file);
      return upload, res[0];
    },

    createComment: async (_, { postId, text, user, isTesting = false }) => {
      const createdat = new Date();
      const values = [postId, text, user, createdat];

      const test = await setTransaction(
        'INSERT INTO "Comment"("postId", text, "user", "createdat") VALUES ($1, $2, $3, $4)RETURNING *',
        values,
        isTesting
      );
      return test[0];
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
