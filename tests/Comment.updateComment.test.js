const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');
const { PubSub } = require('graphql-subscriptions');

pubsub = new PubSub();
const server = new ApolloServer({ typeDefs, resolvers, context: () => pubsub });
const { mutate } = createTestClient(server);

it('Update a comment', async () => {
  const UPDATE_COMMENT = gql`
    mutation UPDATE_COMMENT($id: ID!, $text: String!, $isTesting: Boolean) {
      updateComment(id: $id, text: $text, isTesting: $isTesting) {
        id
        postId
        text
        user
        createdAt
      }
    }
  `;

  const result = await mutate({
    mutation: UPDATE_COMMENT,
    variables: {
      id: 32,
      text: 'text test',
      isTesting: true,
    },
  });

  expect(result.data.updateComment).toBeTruthy();
  expect(result.data.updateComment.id).toBe('32');
  expect(result.data.updateComment.text).toBe('text test');
});
