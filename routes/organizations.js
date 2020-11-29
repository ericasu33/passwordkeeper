/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/sites,
 *   these routes are mounted onto /sites
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  //sees all organizations user belongs to
  router.get("/", (req, res) => {
    let query = `
    SELECT organization_id, name, logo_url 
    FROM organizations
    JOIN user_organizations_role ON organizations.id = user_organizations_role.organization_id
    WHERE user_id = $1;
    `;
    console.log(query, [1]);

    db.query(query, [1])
      .then(data => {
        const organizations = data.rows;
        res.render("organizations", {organizations});
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // goes to page with all the sites for the specific organization
  router.get("/:organization_id/sites", (req, res) => {
    const query = `
    SELECT organization_id, name, logo_url 
    FROM organizations
    JOIN user_organizations_role ON organizations.id = user_organizations_role.organization_id
    WHERE user_id = $1;
    `;
    console.log(query);

    db.query(query, [1])
      .then(data => {
        const organizations = data.rows;
        console.log(organizations);
        res.render("sites", { organizations });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });



  router.get("/new", (req, res) => {
    res.render("organizations_new");
  });


  //create new organization
  router.post("/", (req, res) => {
    const orgName = req.body.name;
    const logoUrl = req.body.logo_url;

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



  return router;
};
