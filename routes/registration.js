const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const express = require('express');
const router  = express.Router();
router.use(cookieSession({
  name: 'session',
  keys: ["lilduck"],
}));

module.exports = (db) => {
  const addUser =  function(user) {
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
    res.render("user_registerations");
  });

};
