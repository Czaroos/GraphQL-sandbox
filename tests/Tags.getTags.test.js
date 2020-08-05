const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');

const server = new ApolloServer({ typeDefs, resolvers });
const { query } = createTestClient(server);

it('Get all tags', async () => {
  const GET_TAGS = gql`
    query GET_TAGS {
      getTags {
        tag
        
      }
    }
  `;

  const result = await query({
    query: GET_TAGS,
  });

  expect(result.data.getTags.length).toEqual(2);
  expect(result.data.getTags).toBeTruthy;
  expect(result.data.getTags[0]).toBeTruthy;
  expect(result.data.getTags[1]).toBeTruthy;
});
