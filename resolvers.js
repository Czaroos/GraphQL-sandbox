const Subscription = require('./subscription');
const Mutation = require('./mutation');
const Query = require('./query');

const resolvers = { Query, Mutation, Subscription };

module.exports = resolvers;
