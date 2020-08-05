const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');

const server = new ApolloServer({ typeDefs, resolvers });
const { query } = createTestClient(server);

it('Get comments by PostId', async () => {
  const GET_COMMENTS_BY_POSTID = gql`
    query GET_COMMENT_BY_POSTID($postId: ID = 1) {
        getPostComments(postId: $postId) {
        postId
        text
        createdAt
      }
    }
  `;

  const result = await query({
    query: GET_COMMENTS_BY_POSTID,
    variables: {
      postId: 1,
    },
  });

  expect(result.data.getPostComments).toBeTruthy();
});
