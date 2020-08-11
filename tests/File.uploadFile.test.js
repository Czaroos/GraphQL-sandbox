const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');
const fs = require('fs');
const fileStream = fs.createReadStream('tests/testFilesInput/t1.png');

const server = new ApolloServer({ typeDefs, resolvers });
const { mutate } = createTestClient(server);

it('Upload a file', async () => {
  const UPLOAD_FILE = gql`
    mutation UPLOAD_FILE($file: Upload!, $PostId: ID!) {
      uploadFile(file: $file, PostId: $PostId) {
        filename
        mimetype
        path
        PostId
      }
    }
  `;

  const result = await mutate({
    mutation: UPLOAD_FILE,
    variables: {
      PostId: 1,
      file: new Promise((resolve) => {
        resolve({
          createReadStream: () => fileStream,
          stream: fileStream,
          filename: 't1.png',
          mimetype: `image/png`,
        });
      }),
    },
  });

  const { filename, mimetype, path, postId } = result.data.uploadFile;
  expect(result.data.uploadFile).toBeTruthy();
  expect(path).toBe('uploaded/t1.png');
  expect(filename).toBe('t1.png');
  expect(mimetype).toBe('image/png');
  expect(postId).toBe(1);
  const fileExists = await fs.promises
    .access(path)
    .then(() => true)
    .catch(() => false);
  expect(fileExists).toBe(true);
});
