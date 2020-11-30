const findRegisteredUser = (db, userEmail) => {
  const query = `
  SELECT id
  FROM users
  WHERE email = $1
  `;

  const queryParams = [userEmail];

  return db.query(query, queryParams)
    .then(users => {
      const userId = users.rows[0].id;
      return userId;
    });
};

const findUserInOrganization = (db, userId, orgId) => {
  const query = `
  SELECT id 
  FROM user_organizations_role
  WHERE user_id = $1 AND organization_id = $2;
  `;

  const queryParams = [userId, orgId];

  return db.query(query, queryParams);
};

const addUserToOrganization = (db, userId, orgId,) => {
  const query = `
  INSERT INTO user_organizations_role (user_id, organization_id, admin_privileges)
  VALUES ($1, $2, $3)
  RETURNING *
  `;

  const queryParams = [userId, orgId, "false"];

  return db.query(query, queryParams);
};

const deleteUser = (db, orgId, userId) => {
  const query = `
    DELETE FROM user_organizations_role 
    WHERE organization_id = $1 AND user_id = $2;
    `;

  const queryParams = [orgId, userId];

  console.log("WHAT TF IS DELETED...", query, queryParams);

  return db.query(query, queryParams);
};


module.exports = {
  findRegisteredUser,
  findUserInOrganization,
  addUserToOrganization,
  deleteUser,
};