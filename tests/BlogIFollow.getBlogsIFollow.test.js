const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');

const server = new ApolloServer({ typeDefs, resolvers });
const { query } = createTestClient(server);

it('Get all blogs i follow', async () => {
  const GET_BLOGS = gql`
    query GET_BLOGS {
      getBlogsIFollow {
        url
      }
    }
  `;

  const result = await query({
    query: GET_BLOGS,
  });

  expect(result.data.getBlogsIFollow.length).toEqual(2);
  expect(result.data.getBlogsIFollow).toBeTruthy;
  expect(result.data.getBlogsIFollow[0]).toBeTruthy;
  expect(result.data.getBlogsIFollow[1]).toBeTruthy;
});
