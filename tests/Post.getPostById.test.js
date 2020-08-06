const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');

const server = new ApolloServer({ typeDefs, resolvers });
const { query } = createTestClient(server);

it('Get one post by ID', async () => {
  const GET_POST_BY_ID = gql`
    query GET_POST_BY_ID($id: ID!) {
      getPostById(id: $id) {
        id
        title
        text
        comments {
          text
        }
        createdAt
        tags
      }
    }
  `;

  const result = await query({
    query: GET_POST_BY_ID,
    variables: {
      id: 1,
    },
  });

  expect(result.data.getPostById).toBeTruthy();
});
