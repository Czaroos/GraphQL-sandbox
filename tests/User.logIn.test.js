const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const gql = require('graphql-tag');
sha3_512 = require('js-sha3').sha3_512;

const server = new ApolloServer({ typeDefs, resolvers });
const { mutate } = createTestClient(server);

it('Log in a user', async () => {
  const LOG_IN = gql`
    mutation LOG_IN($email: String!, $password: String!) {
      logIn(email: $email, password: $password) {
        name
        email
        userId
      }
    }
  `;

  const result = await mutate({
    mutation: LOG_IN,
    variables: {
      email: 'abra@gmail.com',
      password: '1997',
    },
  });

  expect(result.data.logIn).toBeTruthy();
  expect(result.data.logIn.name).toBe('user3');
  expect(result.data.logIn.userId).toBe('7');
  expect(result.data.logIn.email).toBe('abra@gmail.com');
});
