/*
 * All routes for sites are defined here
 * Since this file is loaded in server.js
 *   these routes are mounted onto /sites
 */

const express = require('express');
const router  = express.Router();

const { findUserEmail } = require('../db/helpers/organizations/organization_users');


module.exports = (db) => {

  // Display all the websites
  router.get("/:organization_id/sites", (req, res) => {
    console.log("diplay sites get request");
    const orgId = req.params.organization_id;
    console.log(orgId);
    const userId = req.session.user_id;

    let query = `SELECT * FROM websites JOIN categories ON categories.id = category_id WHERE organization_id=$1 `;
    console.log(query);
    db.query(query, [orgId])
      .then(data => {
        const sites = data.rows;
        console.log(sites);
        return findUserEmail(db, userId)
          .then(email => {
            const templateVars = {
              sites,
              orgId,
              email,
            };
            res.render("sites", templateVars);
          });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Add a new website
  router.post("/:organization_id/sites", (req, res) => {
    const record = req.body;
    const orgId = req.params.organization_id;
    console.log(record);
    console.log(orgId);

    const params = [orgId, record.category, record.name, record.username, record.password, record.email];
    const query = `INSERT INTO websites (organization_id, category_id, name, username, password, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    console.log(query);
    db.query(query, params)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect(`/organization/${orgId}/sites`);
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Deletes an entry
  router.post("/:organization_id/sites/:site/delete", (req, res) => {
    console.log(req.params.site);
    const siteId = [req.params.site];
    const orgId = req.params.organization_id;

    const query = `DELETE FROM websites WHERE id=$1`;
    console.log(query);

    db.query(query, siteId)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect(`/organization/${orgId}/sites`);
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  // Shows the details of a site so it can be updated
  router.get("/:organization_id/sites/:site", (req, res) => {
    console.log(`Req params site: ${req.params.site}`);
    const siteId = [req.params.site];
    const orgId = req.params.organization_id;
    const userId = req.session.user_id;

    const query = `SELECT * FROM websites WHERE id=$1`;

    console.log(`Query: ${query}`);
    console.log(siteId);

    db.query(query, siteId)
      .then(data => {
        const site = data.rows[0];
        console.log(data.rows);
        global_site_id = site.id;
        console.log("Global site id: " + global_site_id);

        return findUserEmail(db, userId)
          .then(email => {
            const templateVars = {
              site,
              orgId,
              email,
            };
            res.render("site", templateVars);
          });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Update a site entry
  router.post("/:organization_id/sites/:site/update", (req, res) => {
    console.log(req.body);
    site = [req.body];
    const orgId = req.params.organization_id;
    console.log(orgId);
    const params = [req.body.name, req.body.username, req.body.email, req.body.category, req.body.password, req.params.site];

    const query = `UPDATE websites SET name=$1, username=$2, email=$3, category_id=$4, password=$5  WHERE id=$6 RETURNING *`;
    console.log(query);

    db.query(query, params)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect(`/organization/${orgId}/sites`);
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });




  return router;
};
