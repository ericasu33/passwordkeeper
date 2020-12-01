DROP TABLE IF EXISTS user_organizations_role CASCADE;

CREATE TABLE user_organizations_role (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  admin_privileges BOOLEAN NOT NULL DEFAULT FALSE
);
