const viewOrg = require('./organization_view');
const newOrg = require('./organization_new');
const editOrg = require('./organization_edit');
const orgUsers = require('./organization_users');
const authenticate = require('./organization_authentication');

module.exports = {
  ...viewOrg,
  ...newOrg,
  ...editOrg,
  ...orgUsers,
  ...authenticate,
};