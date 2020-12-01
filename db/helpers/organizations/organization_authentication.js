const getUser = (db, userId) => {
  const query = `
  SELECT email
  FROM users
  WHERE id = $1
  `;

  const queryParams = [userId];

  return db.query(query, queryParams)
    .then(data => {
      if (data.rows.length < 1) {
        return false;
      }
      return true;
    });
};


module.exports = {
  getUser,
};