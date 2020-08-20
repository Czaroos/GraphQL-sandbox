const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');
const { PubSub } = require('graphql-subscriptions');

pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => pubsub,
});
const { mutate } = createTestClient(server);

it('Delete one comment by ID', async () => {
  const DELETE_COMMENT_BY_ID = gql`
    mutation DELETE_COMMENT_BY_ID($id: ID!, $isTesting: Boolean) {
      deleteCommentById(id: $id, isTesting: $isTesting) {
        id
        user
        createdAt
        postId
        text
      }
    }
  `;

  const result = await mutate({
    mutation: DELETE_COMMENT_BY_ID,
    variables: {
      id: 32,
      isTesting: true,
    },
  });

  expect(result.data.deleteCommentById).toBeTruthy();
});
