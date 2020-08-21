require('cross-fetch/polyfill');
const { getClient } = require('../utils/getClient');
const gql = require('graphql-tag');

const client = getClient();

test('It should subscribe to comments for a particular post', async (done) => {
  const COMMENT_SUBSCRIPTION = gql`
    subscription($postId: ID!) {
      comment(postId: $postId) {
        mutation
        data {
          id
          postId
          text
          createdAt
          user
        }
      }
    }
  `;

  const DELETE_COMMENT_BY_ID = gql`
    mutation($id: ID!, $isTesting: Boolean) {
      deleteCommentById(id: $id, isTesting: $isTesting) {
        id
        postId
        text
        createdAt
        user
      }
    }
  `;

  client
    .subscribe({ query: COMMENT_SUBSCRIPTION, variables: { postId: 265 } })
    .subscribe({
      next(response) {
        // Assertions
        expect(response.data.comment.mutation).toBe('DELETED');
        done();
      },
    });

  // Delete a comment
  await client.mutate({
    mutation: DELETE_COMMENT_BY_ID,
    variables: {
      id: 32,
      isTesting: true,
    },
  });
});
