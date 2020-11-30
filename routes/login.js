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
    res.redirect('/');
  });


  return router;
};


/* *
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
   */
/*   const getUserWithEmail = function(email) {
    console.log(email);
    return db.query(`
      SELECT * FROM users
      WHERE email = $1;
    `,[email])
      .then(res => {
        const user = res.rows;
        console.log(res.rows);
        if (user) {
          return user;
        } else {
          return null;
        }
      });
  };

  const login =  function(email, password) {
    return getUserWithEmail(email)
      .then(user => {
        console.log(user.email);
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  };
  exports.login = login; */

/*   router.post('/users', (req, res) => {
    const {email, password} = req.session.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        res.send({user: {email: user.email, id: user.id}});
      })
      .catch(e => res.send(e));
  });

*/
