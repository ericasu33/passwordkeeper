const getOrganization = (db, userId, organizationId) => {
  const query = `
  SELECT organization_id, organizations.name AS org_name, logo_url, user_id
  FROM organizations
  JOIN user_organizations_role ON organizations.id = user_organizations_role.organization_id
  WHERE user_id = $1 AND organization_id = $2;
  `;

  const queryParams = [userId, organizationId];

  return db.query(query, queryParams)
    .then(data => {
      const organization = data.rows[0];
      return organization;
    });
};

const updateOrganizationDetails = (db, orgId, orgName, logoUrl) => {
  let query = `UPDATE organizations`;
  const queryParams = [];

  if (orgName && logoUrl) {
    queryParams.push(orgName, logoUrl, orgId);

    query += `
      SET name = $1, logo_url = $2
      WHERE id = $3;
      `;
  } else if (orgName) {
    queryParams.push(orgName, orgId);

    query += `
      SET name = $1
      WHERE id = $2;
      `;
  } else if (logoUrl) {
    queryParams.push(logoUrl, orgId);

    query += `
      SET logo_url = $1
      WHERE id = $2;
      `;
  }

  return db.query(query, queryParams);
};

const deleteOrganization = (db, orgId) => {
  const query = `
    DELETE FROM organizations
    WHERE id = $1;
    `;

  const queryParams = [orgId];

  return db.query(query, queryParams);
};

module.exports = {
  getOrganization,
  updateOrganizationDetails,
  deleteOrganization,
};