const { setQuery } = require('../utils/queries');
const { AuthenticationError } = require('apollo-server');

const User = {
  getUser: async (token) => {
    const user = await setQuery(`SELECT * FROM "users" WHERE token=${token}`);
    return user;
  },
  getUser: async (email, password) => {
    const user = await setQuery(`SELECT * FROM "users" WHERE email=${email}`);
    if (!user) return new AuthenticationError('User doesnt exist in database');
    if (user.password === password) return user;

    return new AuthenticationError('User');
  },
};

module.exports = User;
