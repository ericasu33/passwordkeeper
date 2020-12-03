const getOrganizations = (db, userId) => {
  const query = `
  SELECT organization_id, name, logo_url, admin_privileges
  FROM organizations
  JOIN user_organizations_role ON organizations.id = user_organizations_role.organization_id
  WHERE user_id = $1
  ORDER BY organization_id;
  `;

  const queryParam = [userId];

  return db.query(query, queryParam)
    .then(data => data.rows);
};

const getSites = (db, orgId) => {
  const query = `
  SELECT categories.name AS category_name, websites.*
  FROM websites
  JOIN categories ON categories.id = websites.category_id
  WHERE organization_id = $1;
  `;

  const queryParams = [orgId];

  return db.query(query, queryParams)
    .then(data => data.rows);
};

const getCategories = (db) => {
  const query = `
  SELECT * FROM categories;
  `;

  return db.query(query)
    .then(data => data.rows);
};

module.exports = {
  getOrganizations,
  getSites,
  getCategories,
};