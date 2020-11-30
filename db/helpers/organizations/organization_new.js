const createOrganization = (db, orgName, logoUrl) => {
  let query;
  const queryParams = [];

  if (orgName && !logoUrl) {
    queryParams.push(orgName);

    query = `
    INSERT INTO organizations (name)
    VALUES ($1)
    RETURNING *;
    `;
  } else {
    queryParams.push(orgName, logoUrl);

    query = `
    INSERT INTO organizations (name, logo_url)
    VALUES ($1, $2)
    RETURNING *;
    `;
  }

  return db.query(query, queryParams)
    .then(data => {
      const organizationId = data.rows[0].id;
      return organizationId;
    });

};

const linkUserToOrganization = (db, userId, orgId) => {
  const query = `
  INSERT INTO user_organizations_role (user_id, organization_id, admin_privileges)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;

  const queryParams = [userId, orgId, "true"];

  return db.query(query, queryParams)
    .then(data => data.rows);
};


module.exports = {
  createOrganization,
  linkUserToOrganization,
};