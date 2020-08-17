const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');
const { getUser } = require('../models/User');
const fs = require('fs');
const fileStream = fs.createReadStream('tests/testFilesInput/t1.png');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const { mutate } = createTestClient(server);

it('Update a post', async () => {
  const UPDATE_POST = gql`
    mutation UPDATE_POST(
      $id: ID!
      $title: String!
      $text: String!
      $tags: [String]
      $isTesting: Boolean
      $file: Upload
    ) {
      updatePost(
        id: $id
        title: $title
        text: $text
        tags: $tags
        isTesting: $isTesting
        file: $file
      ) {
        id
        title
        text
        tags
        userId
        imageUrl
      }
    }
  `;

  const result = await mutate({
    mutation: UPDATE_POST,
    variables: {
      id: 264,
      title: 'testUpdate',
      text: 'This is a test for update',
      tags: ['test', 'tag'],
      isTesting: true,
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

  const { title, text } = result.data.updatePost;
  expect(title.trim() && text.trim()).not.toBe('');
  expect(result.data.updatePost).toBeTruthy();
  expect(result.data.updatePost.id).toBe('264');
  expect(result.data.updatePost.title).toBe('testUpdate');
  expect(result.data.updatePost.text).toBe('This is a test for update');
});
