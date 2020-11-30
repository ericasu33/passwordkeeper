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

  router.post("/register", (req, res) => {
    const query = `
    SELECT * FROM users WHERE email = $1;
    `;
    const queryParams = [req.body.email];
    db.query(query, queryParams)
      .then(data => {
        const user = data.rows[0];
        req.session.user_id = user.id;
        res.redirect('/organizations');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  return router;
};


  //const registerRoutes = require("./routes/registeration");
  //app.use("/registeration", registerRoutes(db));




  /* router.post("/register", (req, res) => {
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
    };
    if (!newUser.email || !newUser.password) {
      res.statusCode = 400;
      return res.send("Email or Password was not found. Please try again!");
    }
    const foundUser = findUserByEmail(newUser.email, users);
    if (foundUser) {
      res.status(400).send("Email has been registered!");
    }
    if (!password) {
      return res.status(403).send("Username or password not found!");
    }
    users[id] = newUser;
    req.session.userID = newUser.id;
    res.redirect("/organization");
  }); */

db.query(`
    INSERT INTO users(name, email, password)
    VALUES ($1, $2, $3) RETURNING *;
  `, data)
