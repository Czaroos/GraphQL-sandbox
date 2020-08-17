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
    mutation UPLOAD_FILE($file: Upload!, $postId: ID!, $isTesting: Boolean) {
      uploadFile(file: $file, postId: $postId, isTesting: $isTesting) {
        filename
        mimetype
        path
        postId
      }
    }
  `;

  const result = await mutate({
    mutation: UPLOAD_FILE,
    variables: {
      file: new Promise((resolve) => {
        resolve({
          createReadStream: () => fileStream,
          stream: fileStream,
          filename: 't1.png',
          mimetype: `image/png`,
        });
      }),
      postId: 245,
      isTesting: true,
    },
  });

  const { filename, mimetype, path, postId } = result.data.uploadFile;
  expect(result.data.uploadFile).toBeTruthy();
  expect(path).toBe('uploaded/t1.png');
  expect(filename).toBe('t1.png');
  expect(mimetype).toBe('image/png');
  expect(postId).toBe('245');
  const fileExists = await fs.promises
    .access(path)
    .then(() => true)
    .catch(() => false);
  expect(fileExists).toBe(true);
});
