const { createTestClient } = require('apollo-server-testing');
const { server } = require('../index');
const gql = require('graphql-tag');

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
  expect(result.data.getPosts[0]).not.toBeNull();
  expect(result.data.getPosts[1]).not.toBeNull();
});
