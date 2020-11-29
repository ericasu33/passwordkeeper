/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const express = require('express');
const router  = express.Router();
router.use(cookieSession({
  name: 'session',
  keys: ["lilduck"],
}));

module.exports = (db) => {

  router.get("/", (req, res) => {
    let query = `SELECT * FROM users WHERE id = $1`;
    //console.log(req.session.user_id);
    db.query(query, [req.session.user_id])
      .then(data => {
        const users = data.rows;
        console.log('LOOKING HERE:', users);
        console.log(users[0].email);
        res.render('user_login', { users });
        //res.json('/users', { users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  router.get('/:id', (req, res) => {
    res.redirect('/users');
  });
  /* const addUser =  function(user) {
    const data = [user.name, user.email, user.password];
    db.query(`
    INSERT INTO users(name, email, password)
    VALUES ($1, $2, $3) RETURNING *;
    `, data)
      .then(res => {
        if (res.rows[0].name || res.rows[0].email) {
          return res.rows[0];
        } else {
          return null;
        }

      });
  };

  router.get("/register", (req, res) => {
    const user = req.body;
    addUser(user)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        res.send("🤗");
      });
    res.render("urls_register", templateVars);
  });
 */


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

  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.send({});
  }); */
