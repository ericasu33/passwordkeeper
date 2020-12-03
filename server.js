// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const methodOverride = require('method-override');



// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["lilduck"],
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(methodOverride('_method'));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/login");
const sitesRoutes = require("./routes/sites");
const orgRoutes = require("./routes/organizations");

// Mount all resource routes
app.use("/login", loginRoutes(db));
app.use("/login", registerRoutes(db));
app.use("/organization", sitesRoutes(db));
app.use("/organizations", orgRoutes(db));


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
const { findUserEmail } = require('./db/helpers/organizations/organization_users');

app.get("/", (req, res) => {
  const userId = req.session.user_id;

  if (userId) {
    findUserEmail(db, userId)
      .then(email => {
        res.render("landing_logged_in", { email });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  } else {
    res.render("landing");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
