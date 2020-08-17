const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');

const server = new ApolloServer({ typeDefs, resolvers });
const { mutate } = createTestClient(server);

it('Delete one post by ID', async () => {
  const DELETE_POST_BY_ID = gql`
    mutation DELETE_POST_BY_ID($id: ID!, $isTesting: Boolean) {
      deletePostById(id: $id, isTesting: $isTesting) {
        id
        title
        text
        comments {
          text
        }
        createdAt
        tags
        userId
        imageUrl
      }
    }
  `;

  const result = await mutate({
    mutation: DELETE_POST_BY_ID,
    variables: {
      id: 265,
      isTesting: true,
    },
  });

  expect(result.data.deletePostById).toBeTruthy();
});
