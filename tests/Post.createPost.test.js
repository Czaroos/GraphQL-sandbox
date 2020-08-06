const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');
const fs = require('fs');
const fileStream = fs.createReadStream('test.jpeg');
const server = new ApolloServer({ typeDefs, resolvers });
const { mutate } = createTestClient(server);

it('Create a post', async () => {
  const CREATE_POST = gql`
    mutation CREATE_POST(
      $title: String!
      $text: String!
      $tags: [String]
      $pictures: Picture
    ) {
      createPost(title: $title, text: $text, tags: $tags, picture: $pictures) {
        id
        title
        text
        comments {
          text
        }
        createdAt
        tags
        pictures
      }
    }
  `;

  const result = await mutate({
    mutation: CREATE_POST,
    variables: {
      title: 'testPost',
      text: 'This is a test post',
      tags: ['test', 'tag'],
      pictures: [
        new Promise((resolve) =>
          resolve({
            createReadStream: () => fileStream,
            stream: fileStream,
            filename: 'test',
            mimetype: `image/jpeg`,
          })
        ),
      ],
    },
  });

  const { title, text } = result.data.createPost;
  expect(title.trim() && text.trim()).not.toBe('');
  expect(result.data.createPost).toBeTruthy;
});
