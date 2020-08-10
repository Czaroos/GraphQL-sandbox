const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { createWriteStream, mkdir, readdirSync } = require('fs');
const client = require('./databaseConnection');
const path = require('path');
const uploadedDirPath = path.join(__dirname, 'uploaded');
const mime = require('mime');
const { Pool } = require('pg');
const pool = new Pool();

const storeUpload = async ({ stream, filename, mimetype }) => {
  const path = `uploaded/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path, filename, mimetype }))
      .on('error', reject)
  );
};

const setQuery = async (queryString, values) => {
  client.connect();
  try {
    const res = await client.query(queryString, values);
    client.end();
    return res.rows;
  } catch (err) {
    client.end();
    console.log(err);
  }
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
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
    createPost: async (_, { title, text, tags }) => {
      const createdAt = new Date();
      const values = [title, text, tags, createdAt];

      const res = await setQuery(
        'INSERT INTO "Post" (title, text, tags, "createdAt") VALUES ($1, $2, $3, $4) RETURNING *',
        values
      );
      console.log(res[0]);
      return res[0];
    },

    uploadFile: async (_, { file }) => {
      mkdir('uploaded', { recursive: true }, (err) => {
        if (err) throw err;
      });
      const upload = await processUpload(file);
      return upload;
    },

    createComment: async (_, { postId, text, user }) => {
      const createdat = new Date();
      const values = [postId, text, user, createdat];

      const test =
        'INSERT INTO "Comment"("postId", text, "user", "createdat") VALUES ($1, $2, $3, $4)RETURNING *';
      try {
        const res = await client.query(test, values);
        console.log(res.rows);
        return res.rows;
      } catch (err) {
        console.log(err);
      }
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
