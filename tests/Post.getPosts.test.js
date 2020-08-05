const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');

const server = new ApolloServer({ typeDefs, resolvers });
const { query } = createTestClient(server);

it('Get all posts', async () => {
  const GET_POSTS = gql`
    query GET_POSTS {
      getPosts {
        id
        title
        text
        comments {
          text
        }
        createdAt
        tags {
          tag
        }
      }
    }
  `;

  const result = await query({
    query: GET_POSTS,
  });

  expect(result.data.getPosts.length).toEqual(2);
  expect(result.data.getPosts).toBeTruthy;
  expect(result.data.getPosts[0]).toBeTruthy;
  expect(result.data.getPosts[1]).toBeTruthy;
});
