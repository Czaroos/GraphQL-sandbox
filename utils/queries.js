const { pool } = require('../databaseConnection');

const setQuery = async (queryString, values) => {
  const res = await pool.connect().then((client) => {
    return client
      .query(queryString, values)
      .then((res) => {
        client.release();
        return res;
      })
      .catch((err) => {
        client.release();
        console.log(err);
      });
  });
  return res.rows;
};

const setTransaction = async (queryString, values, isTesting) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query(queryString, values);

    if (isTesting) {
      await client.query('ROLLBACK');
      console.log('test passed');
      return res.rows;
    } else {
      await client.query('COMMIT');
      return res.rows;
    }
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = { setQuery, setTransaction };
