/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/sites,
 *   these routes are mounted onto /sites
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM websites`;
    console.log(query);
    db.query(query)
      .then(data => {
        const sites = data.rows;
        console.log(sites.name);
        //res.json ({sites})
        res.render("index", {sites});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
