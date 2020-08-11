const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');

const server = new ApolloServer({ typeDefs, resolvers });
const { mutate } = createTestClient(server);

it('Create a comment', async () => {
  const CREATE_COMMENT = gql`
    mutation CREATE_COMMENT($postId: ID!, $text: String!, $user: String!) {
      createComment(postId: $postId, text: $text, user: $user) {
        postId
        text
        createdAt
        user
      }
    }
  `;

  const result = await mutate({
    mutation: CREATE_COMMENT,
    variables: {
      postId: 1,
      text: 'text test',
      user: 'test user',
    },
  });

  expect(result.data.createComment).toBeTruthy;
});
