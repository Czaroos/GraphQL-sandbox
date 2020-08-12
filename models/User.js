const { setQuery } = require('../utils/queries');
const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = {
  //   getUser: async (token) => {
  //     const user = await setQuery(`SELECT * FROM "users" WHERE token=${token}`);
  //     return user;
  //   },
  logInUser: async (email, password) => {
    const user = await setQuery(`SELECT * FROM "users" WHERE email='${email}'`);
    if (!user) return new AuthenticationError('User doesnt exist in database');
    if (user[0].password !== password)
      return new AuthenticationError('Incorrect password');

    const token = jwt.sign(
      { mail: user.mail },
      process.env.ACCESS_TOKEN_SECRET
    );
    // const userAssignedToken = await setQuery(
    //   `UPDATE "users" SET token=${token} WHERE email=${email}`
    // );
    console.log({ ...user[0], token });
    return { ...user[0], token };
  },
};

module.exports = User;
