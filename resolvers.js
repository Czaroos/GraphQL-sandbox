const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const posts = [
    {
      id: 1,
      title: 'tytul',
      text: 'tekst',
      createdAt: Date.now,
    },
    {
        id: 2,
        title: 'tytul2',
        text: 'tekst2',
        createdAt: Date.now,
        comments: []
      },
  ];
const resolvers = {
    Query: {
        getPosts: () => posts,
      },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

module.exports = resolvers;
