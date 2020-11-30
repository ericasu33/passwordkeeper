const getOrganizations = (db, userId) => {
  const query = `
  SELECT organization_id, name, logo_url
  FROM organizations
  JOIN user_organizations_role ON organizations.id = user_organizations_role.organization_id
  WHERE user_id = $1
  ORDER BY organization_id;
  `;

  const queryParam = [userId];

  return db.query(query, queryParam)
    .then(data => {
      const organizations = data.rows;
      return organizations;
    });
  
};

const getSites = (db, orgId) => {
  const query = `
  SELECT *
  FROM websites
  WHERE organization_id = $1;
  `;

  const queryParams = [orgId];

  return db.query(query, queryParams)
    .then(data => {
      const sites = data.rows;
      return sites;
    });
  
};

module.exports = {
  getOrganizations,
  getSites,
};