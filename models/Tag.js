const { setQuery } = require('../utils/queries');

const addTag = async (tag) => {
  const tagExistsInDatabase = await setQuery(
    `SELECT * FROM "tags" WHERE "tag"='${tag}'`
  );

  if (tagExistsInDatabase.length === 0) {
    return await setQuery(
      `INSERT INTO "tags" (tag, weight) VALUES ($1, $2) RETURNING *`,
      [tag, 0]
    );
  }

  return await setQuery(
    `UPDATE "tags" SET weight=${
      tagExistsInDatabase[0].weight + 1
    } WHERE tag='${tag}' RETURNING *`
  );
};

module.exports = { addTag };
