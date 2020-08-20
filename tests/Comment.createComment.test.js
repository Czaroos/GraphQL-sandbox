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

it('Create a comment', async () => {
  const CREATE_COMMENT = gql`
    mutation CREATE_COMMENT(
      $postId: ID!
      $text: String!
      $user: String!
      $isTesting: Boolean
    ) {
      createComment(
        postId: $postId
        text: $text
        user: $user
        isTesting: $isTesting
      ) {
        id
        postId
        text
        user
        createdAt
      }
    }
  `;

  const result = await mutate({
    mutation: CREATE_COMMENT,
    variables: {
      postId: 265,
      text: 'text test',
      user: 'test user',
      isTesting: true,
    },
  });
  console.log(result);
  expect(result.data.createComment).toBeTruthy();
});
