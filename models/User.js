const { setQuery } = require('../utils/queries');
const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = {
  getUser: async (token) => {
    const user = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) return console.log('error');
        const correspondingUser = await setQuery(
          `SELECT * FROM "users" WHERE "userId"=${user.userId}`
        );
        return correspondingUser[0];
      }
    );
    return user;
  },
  logInUser: async (email, password) => {
    const user = await setQuery(`SELECT * FROM "users" WHERE email='${email}'`);
    if (!user) return new AuthenticationError('User doesnt exist in database');
    if (user[0].password !== password)
      return new AuthenticationError('Incorrect password');
    const token = jwt.sign(
      { userId: user[0].userId },
      process.env.ACCESS_TOKEN_SECRET
    );

    return { ...user[0], token };
  },
};

module.exports = User;
