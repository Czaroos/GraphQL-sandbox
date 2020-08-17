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
  context: async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTU5NzQwMDM5M30.Kkyexcq9iVPQknW4SWDTadFSNltGZ0FojSbepLEa0yo';
    const user = await getUser(token);
    return { user };
  },
});
const { mutate } = createTestClient(server);

it('Create a post', async () => {
  const CREATE_POST = gql`
    mutation CREATE_POST(
      $title: String!
      $text: String!
      $tags: [String]
      $isTesting: Boolean
      $file: Upload
    ) {
      createPost(
        title: $title
        text: $text
        tags: $tags
        isTesting: $isTesting
        file: $file
      ) {
        id
        title
        text
        createdAt
        tags
        userId
        imageUrl
      }
    }
  `;

  const result = await mutate({
    mutation: CREATE_POST,
    variables: {
      title: 'testPost',
      text: 'This is a test post',
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

  const { title, text } = result.data.createPost;
  expect(title.trim() && text.trim()).not.toBe('');
  expect(result.data.createPost).toBeTruthy;
});
