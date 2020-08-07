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
    mutation UPLOAD_FILE($file: Upload!) {
      uploadFile(file: $file) {
        filename
        mimetype
        path
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
    },
  });

  const { filename, mimetype, path } = result.data.uploadFile;
  expect(result.data.uploadFile).toBeTruthy();
  expect(path).toBe('uploaded/t1.png');
  expect(filename).toBe('t1.png');
  expect(mimetype).toBe('image/png');
});
