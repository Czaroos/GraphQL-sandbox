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

  },
];
const comments = [
  {
    postId: 1,
    text: 'text',
    createdAt: Date.now,
    user: {
      name: 'String!',
      email: 'String!',
      role: 'USER'  
    }
  },
  {
    postId: 2,
    text: 'text2',
    createdAt: Date.now,
    user: [],
  },
    {
    postId: 1,
    text: 'text3',
    createdAt: Date.now,
    user: [],
  },
];
const tags = [
  {  
    tag: 'WH40K',
  },
  {
   tag: 'Necrons'
  },
];
const blogs = [
  {  
    url: 'https:/fdsfsdf',
  },
  {
   url: 'https://aaaaaaaa.com'
  },
];
const resolvers = {
  Query: {
    getPosts: () => posts,
    getPostById: (_, { id }) => posts.find((post) => post.id == id),
    getPostComments: (_, { postId }) => comments.filter((comment) => comment.postId == postId),
    getTags: () => tags,
    getBlogsIFollow: () => blogs,

  },

  Mutation: {
    createPost: (parent, args) => {
       const createPost = {
        id: args.id,// do poprawy
        title: args.title,
        text: args.text,
        tags: args.tags,// do poprawy
      }
     
      return createPost
    },
    
    createComment: (parent, args) => {
      const createComment = {
       postId: args.postId,
       text: args.text,
     }
      return createComment
    }, 

    addTag: (parent, args) => {
    const addTag = {
     tag: args.tag,
       
    }
      return addTag
    },
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return new Date(value).toDateString();
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
