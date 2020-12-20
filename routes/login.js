/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const bcrypt = require('bcrypt');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    res.redirect('/');
  });

  router.post("/", (req, res) => {
    const query = `
    SELECT * FROM users WHERE email = $1;
    `;
    const queryParams = [req.body.email];
    db.query(query, queryParams)
      .then(data => {
        const user = data.rows[0];
        if (user === undefined) {
          return res.status(400).send("Email or password is wrong!");
        }
        req.session.user_id = user.id;
        res.redirect('/organizations');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });


  return router;
};



