const resSendError = (res, orgId) => {
  res.status(406).send({
    error: 'User is already a member',
    result: 'redirect',
    url:`/organizations/${orgId}`
  });
};

const getUsersForOrganization = (db, orgId) => {
  const query = `
  SELECT users.id, name, email, admin_privileges
  FROM users
  JOIN user_organizations_role ON user_organizations_role.user_id = users.id
  WHERE organization_id = $1
  ORDER BY users.id;
  `;

  const queryParams = [orgId];

  return db.query(query, queryParams)
    .then(data => {
      const users = data.rows;
      return users;
    });
};

const getUserForOrganization = (db, userId, orgId) => {
  const query = `
  SELECT users.id, name, email, admin_privileges
  FROM users
  JOIN user_organizations_role ON user_organizations_role.user_id = users.id
  WHERE users.id = $1 AND organization_id = $2
  `;

  const queryParams = [userId, orgId];

  return db.query(query, queryParams)
    .then(data => data.rows);
};

const findUserEmail = (db, userId) => {
  const query = `
  SELECT email
  FROM users
  WHERE id = $1;
  `;

  const queryParams = [userId];

  return db.query(query, queryParams)
    .then(data => {
      return userEmail = data.rows[0].email;
    });
};

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

const deleteUser = (db, userId, orgId) => {
  const query = `
  DELETE FROM user_organizations_role 
  WHERE user_id = $1 AND organization_id = $2;
  `;

  const queryParams = [userId, orgId];

  return db.query(query, queryParams);
};

const giveOwnership = (db, transfereeId, orgId) => {
  const query = `
  UPDATE user_organizations_role
  SET admin_privileges = true
  WHERE user_id = $1 AND organization_id = $2;
  `;

  const queryParams = [transfereeId, orgId];
  
  return db.query(query, queryParams);
};

const removeOwnership = (db, transferorId, orgId) => {
  const query = `
  UPDATE user_organizations_role
  SET admin_privileges = false
  WHERE user_id = $1 AND organization_id = $2;
  `;

  const queryParams = [transferorId, orgId];
  return db.query(query, queryParams);
};


module.exports = {
  findRegisteredUser,
  findUserEmail,
  findUserInOrganization,
  getUserForOrganization,
  addUserToOrganization,
  getUsersForOrganization,
  deleteUser,
  resSendError,
  giveOwnership,
  removeOwnership,
};