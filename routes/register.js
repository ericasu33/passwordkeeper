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

  const findUserByEmail = (db, email) => {
    const query = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;

    const queryParams = [email];
    return db.query(query, queryParams)
      .then(data => {
        return data.rows[0];


      });
  };

  router.get("/", (req, res) => {
    res.redirect('/');
  });


  router.post("/", (req, res) => {
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const name = req.body.name;
    const email = req.body.email;

    if (!email || !password) {
      res.statusCode = 400;
      return res.send("Email or Password was not found. Please try again!");
    }
    const foundUserPromise = findUserByEmail(db, email);
    foundUserPromise.then(foundUser => {
      if (foundUser) {
        return res.status(400).send("Email has been registered!");
      }

      const params = [name, hashedPassword, email];
      const query = `INSERT INTO users (name, password,email)   VALUES ($1, $2, $3) RETURNING *`;
      return db.query(query, params)
        .then(data => {
          const user = data.rows[0];
          req.session.user_id = user.id;
          res.redirect("/organizations");
        })
        .catch(err => {
          console.log(err);
          res
            .status(500)
            .json({ error: err.message });
        });
    });



  });


  return router;
};
