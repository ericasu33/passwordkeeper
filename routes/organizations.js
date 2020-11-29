/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/sites,
 *   these routes are mounted onto /sites
 */

const express = require('express');
const router  = express.Router();
const { isUrl } = require('../public/scripts/organization_setting');

const methodOverride = require('method-override');
router.use(methodOverride('_method'));

module.exports = (db) => {

  //sees all organizations user belongs to
  router.get("/", (req, res) => {
    console.log;
    let query = `
    SELECT organization_id, name, logo_url
    FROM organizations
    JOIN user_organizations_role ON organizations.id = user_organizations_role.organization_id
    WHERE user_id = $1
    ORDER BY organization_id;
    `;

    const queryParam = [req.session.user_id];
    console.log(query, queryParam);

    db.query(query, queryParam)  //would be cookie-session here for user_id
      .then(data => {
        const organizations = data.rows;
        res.render("./organizations/organizations", {organizations});
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // goes to page with all the sites for the specific organization
  router.get("/:organization_id/sites", (req, res) => {
    const organization_id = req.params.organization_id;

    const query = `
    SELECT *
    FROM websites
    WHERE organization_id = $1;
    `;

    console.log(query);

    db.query(query, [organization_id])  //would be cookie-session here for user_id
      .then(data => {
        const sites = data.rows;
        // console.log(organizations);
        res.render("sites", { sites });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  //====NEW ORG=====//

  router.get("/new", (req, res) => {
    res.render("./organizations/organizations_new");
  });


  //create new organization
  router.post("/", (req, res) => {
    const orgName = req.body.name;
    const logoUrl = req.body.logo_url;
    const error = true;

    if (!isUrl(logoUrl) || !logoUrl) {
      return res.render("./organizations/organizations_new", { error });
    }

    const queryOrg = `
    INSERT INTO organizations (name, logo_url)
    VALUES ($1, $2)
    RETURNING *;
    `;

    const queryParams = [orgName, logoUrl];
    console.log(queryOrg, queryParams);

    db.query(queryOrg, queryParams)
      .then(data => {
        console.log(data.rows);
        const organization = data.rows[0];
        const organization_id = organization.id;
        return organization_id;
      })
      .then(organization_id => {
        const queryOrgUser = `
        INSERT INTO user_organizations_role (user_id, organization_id, admin_privileges)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;

        const queryParams = [1, organization_id, "true"];

        db.query(queryOrgUser, queryParams)
          .then(data => {
            console.log(data.rows);
            res.redirect("/organizations");
          })
          .catch(err => {
            res
              .status(500)
              .send(err);
          });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  //Edit Org Page
  router.get("/:organization_id", (req, res) => {
    const organizationId = req.params.organization_id;
    const userId = req.session.user_id;

    //get org info
    const query = `
    SELECT organization_id, organizations.name AS org_name, logo_url, user_id
    FROM organizations
    JOIN user_organizations_role ON organizations.id = user_organizations_role.organization_id
    WHERE user_id = $1 AND organization_id = $2;
    `;

    db.query(query, [userId, organizationId])
      .then(data => {
        const organization = data.rows[0];
        console.log("DATAAAA", organization);
        return organization;
      })
      .then(organization => {

        //get all users that belongs to this org
        const queryUsers = `
        SELECT users.id, name, email
        FROM users
        JOIN user_organizations_role ON user_organizations_role.user_id = users.id
        WHERE organization_id = $1
        `;

        const queryParams = [organization.organization_id];

        db.query(queryUsers, queryParams)
          .then(data => {
            const users = data.rows;
            console.log("WHATS HERE in USERS??", users);
            const templateVars = {
              organization,
              users,
            };
            res.render("./organizations/organizations_show", templateVars);
          })
          .catch(err => {
            res
              .status(500)
              .send(err);
          });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });

  });

  //edit organization
  router.post("/:organization_id", (req, res) => {
    const organizationId = req.params.organization_id;
    const organizationName = req.body.orgName;
    const logoUrl = req.body.logo_url;

    // const error = true;

    // if (!isUrl(logoUrl) || !logoUrl) {
    //   return res.render("./organizations/organizations_show", { error });
    // }

    let query;
    const queryParams = [];

    if (organizationName && logoUrl) {
      queryParams.push(organizationName, logoUrl, organizationId);

      query = `
      UPDATE organizations
      SET name = $1, logo_url = $2
      WHERE id = $3;
      `;
    } else if (organizationName) {
      queryParams.push(organizationName, organizationId);

      query = `
      UPDATE organizations
      SET name = $1
      WHERE id = $2;
      `;
    } else if (logoUrl) {
      queryParams.push(logoUrl, organizationId);

      query = `
      UPDATE organizations
      SET logo_url = $1
      WHERE id = $2;
      `;
    } else {
      return res.redirect(`/organizations/${organizationId}`);
    }


    console.log(query, queryParams);
    db.query(query, queryParams)
      .then(data => {
        res.redirect(`/organizations/${organizationId}`);
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  
  //delete organization
  router.post("/:organization_id/delete", (req, res) => {
    const organization_id = req.params.organization_id;

    const query = `
    DELETE FROM organizations
    WHERE id = $1;
    `;
    console.log(query, organization_id);
    db.query(query, [organization_id])
      .then(data => {
        res.redirect("/organizations");
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  //=====Users========//

  //add users
  router.put("/:organization_id", (req, res) => {
    console.log("ARE WE IN PUT??");
    const userEmail = req.body.email;
    const organizationId = req.params.organization_id;

    if (!userEmail) {

      res.redirect(`/organizations/${organizationId}`);
    }

    const queryUser = `
    SELECT id
    FROM users
    WHERE email = $1
    `;
    const queryParams = [userEmail];

    db.query(queryUser, queryParams)
      .then(data => {
        console.log(data.rows);
        const user = data.rows[0];
        const userId = user.id;
        return userId;
      })
      .then(userId => {
        console.log("HERE IS USERID", userId);

        const queryIfExist = `
        SELECT id 
        FROM user_organizations_role
        WHERE user_id = $1 AND organization_id = $2;
        `;

        const queryParams = [userId, organizationId];

        db.query(queryIfExist, queryParams)
          .then(data => {
            if (data.rows[0]) {
              console.log("I EXIST!!!");
              res.redirect(`/organizations/${organizationId}`); // make render error display later
            } else {
              console.log("Nope...nothing here, INSERT!");

              const query = `
              INSERT INTO user_organizations_role (user_id, organization_id, admin_privileges)
              VALUES ($1, $2, $3)
              RETURNING *
              `;

              const queryParams = [userId, organizationId, "false"];

              db.query(query, queryParams)
                .then(data => {
                  console.log(data.rows);
                  res.redirect(`/organizations/${organizationId}`);
                  // make render success display later
                })
                .catch(err => {
                  res
                    .status(500)
                    .send(err);
                });
            }
          })
          .catch(err => {
            res
              .status(500)
              .send(err);
          });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });


  //delete user
  router.delete("/:organization_id/:user_id/delete", (req, res) => {
    const organizationId = req.params.organization_id;
    const userId = req.params.user_id;
    
    const query = `
    DELETE FROM user_organizations_role 
    WHERE organization_id = $1 AND user_id = $2;
    `;

    const queryParams = [organizationId, userId];

    console.log("WHAT TF IS DELETED...", query, queryParams);

    db.query(query, queryParams)
      .then(data => {
        res.redirect(`/organizations/${organizationId}`); //make render sucecss?
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });


  return router;
};
