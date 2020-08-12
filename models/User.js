const User = {
  getUser: async (token) => {
    const user = await setQuery(`SELECT * FROM "users" WHERE token=${token}`);
    return user;
  },
};

module.exports = User;
