/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/organization,
 *   these routes are mounted onto /organization
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM sites WHERE organization_id=1`;
    console.log(query);
    db.query(query)
      .then(data => {
        const organization = data.rows;
        res.json({ organization });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
