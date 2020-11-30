/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/sites,
 *   these routes are mounted onto /sites
 */

const express = require('express');
const router  = express.Router();

let globe_site_id = 0;


module.exports = (db) => {

  // Display all the websites
  router.get("/", (req, res) => {
    let query = `SELECT * FROM websites`;
    console.log(query);
    db.query(query)
      .then(data => {
        const sites = data.rows;
        console.log(sites.name);
        //res.json ({sites})
        res.render("sites", {sites});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Add a new website
  router.post("/", (req, res) => {
    const record = req.body;
    console.log(record);

    const params = [record.category, record.name, record.username, record.password, record.email];
    const query = `INSERT INTO websites (category_id, name, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    console.log(query);
    db.query(query, params)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect("/organization/:organization_id/sites");
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Deletes an entry
  router.post("/:site/delete", (req, res) => {
    console.log(req.params.site);
    site = [req.params.site];

    const query = `DELETE FROM websites WHERE name=$1`;

    console.log(query);
    db.query(query, site)
      .then(data => {
        console.log(data.rows[0]);
        res.redirect("/organization/:organization_id/sites");
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  // Shows the details of a site so it can be updated
  router.get("/:site", (req, res) => {
    console.log(req.params.site);
    site = [req.params.site];

    const query = `SELECT * FROM websites WHERE name=$1`;

    console.log(query)
    db.query(query, site)
      .then(data => {
        const site = data.rows[0];
        console.log(site)
        global_site_id = site.id;
        console.log(global_site_id);
        // res.json ({site})
        res.render("site", {site});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Update a site entry
  router.post("/:site/update", (req, res) => {
    console.log(req.body);
    site = [req.body];
    params = [req.body.name, req.body.username, req.body.email, req.body.category, req.body.password, global_site_id]

    const query = `UPDATE websites SET name=$1, username=$2, email=$3, category_id=$4, password=$5  WHERE id=$6 RETURNING *`;
    console.log(query);

    db.query(query, params)
      .then(data => {
        console.log(data.rows[0]);
        //res.json (data.rows[0])
        res.redirect("/organization/:organization_id/sites");
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
