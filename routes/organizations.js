const express = require('express');
const router  = express.Router();
const { isUrl } = require('../db/helpers/organizations/helper_functions');
const database = require('../db/helpers/organizations/export_all');

module.exports = (db) => {

  //=====Middleware=====//

  const unauthorized = (req, res, next) => {
    database.getUser(db, req.session.user_id)
      .then(user => {
        if (!user) {
          return res.status(401).redirect('/');
        } else {
          next();
        }
      })
      .catch(err => err);
  };

  //=====Error=====//

  router.get('/error', (req, res) => {
    res.status(404).render('./organizations/error_404');
  });

  //=====ORGANIZATIONS=====//

  //User sees all the organizations user belongs to
  router.get("/", unauthorized, (req, res) => {
    const userId = req.session.user_id;

    database.getOrganizations(db, userId)
      .then(organizations => {
        res.render("./organizations/organizations", { organizations });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // User sees all the websites that the particular organization has
  router.get("/:organization_id/sites", unauthorized, (req, res) => {
    const orgId = req.params.organization_id;
    const userId = req.session.user_id;

    database.getUsersForOrganization(db, orgId)
      .then(users => {
        let authUser = true;
        for (const user of users) {
          if (user.id === userId) {
            return authUser;
          }
        }
        authUser = false;
        return authUser;
      })
      .then(authUser => {
        if (!authUser) {
          return res.status(401).redirect("/organizations");
        } else {
          return database.getSites(db, orgId)
            .then(sites => {
              res.render("sites", { sites });
            });
        }
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });


  //=====NEW ORGANIZATION=====//

  router.get("/new", unauthorized, (req, res) => {
    res.render("./organizations/organizations_new");
  });


  // User creates new organization
  router.post("/", (req, res) => {
    const userId = req.session.user_id;
    const orgName = req.body.name;
    const logoUrl = req.body.logo_url;
    //CHANGED "/organizations/new" to "/organizations/error"
    if (!orgName) {
      return res.status(406).redirect("/organizations/error");
    }

    if (logoUrl && !isUrl(logoUrl)) {
      return res.status(406).redirect("/organizations/error");
    }

    database.createOrganization(db, orgName, logoUrl)
      .then(orgId => {
        return database.linkUserToOrganization(db, userId, orgId)
          .then(data => {
            res.status(200).redirect("/organizations");
          });
            /* send({
              result: 'redirect',
              url:'/organization'});
          }); */
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  //=====EDIT ORGANIZATION & USERS=====//

  router.get("/:organization_id", unauthorized, (req, res) => {
    const organizationId = req.params.organization_id;
    const userId = req.session.user_id;

    // Logged in and check if user accessing unauthorized :organization_id
    database.getUsersForOrganization(db, organizationId)
      .then(users => {
        if (users.length < 1) {
          return res.redirect('/organizations/error');
        }

        let authUser = true;
        for (const user of users) {
          if (user.id === userId && user.admin_privileges === true) {
            return authUser;
          }
        }
        authUser = false;
        return authUser;
      })
      .then(authUser => {
        if (!authUser) {
          return res.status(401).redirect("/organizations");
        } else {
          return database.getOrganization(db, userId, organizationId)
            .then(organization => {
              const orgId = organization.organization_id;

              return database.getUsersForOrganization(db, orgId)
                .then(users => {
                  const templateVars = {
                    organization,
                    users,
                  };
                  res.render("./organizations/organizations_show", templateVars);
                });
            });
        }
      })
      .catch(err => {
        return res.status(404).redirect('/organizations/error');
      });
  });

  // Edit organization details
  router.post("/:organization_id", (req, res) => {
    const organizationId = req.params.organization_id;
    const organizationName = req.body.orgName;
    const logoUrl = req.body.logo_url;

    if (!organizationName && !logoUrl) {
      return res.status(406).redirect(`/organizations/${organizationId}`);
    }

    if (logoUrl && !isUrl(logoUrl)) {
      return res.status(406).redirect(`/organizations/${organizationId}`);
    }

    database.updateOrganizationDetails(db, organizationId, organizationName, logoUrl)
      .then(data => {
        res.redirect(`/organizations/${organizationId}`);
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // Delete organization
  router.delete("/:organization_id/delete", (req, res) => {
    const organizationId = req.params.organization_id;

    database.deleteOrganization(db, organizationId)
      .then(data => {
        res.redirect("/organizations");
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // Add Users
  router.put("/:organization_id", (req, res) => {
    const userEmail = req.body.email;
    const organizationId = req.params.organization_id;

    if (!userEmail) {
      return res.status(406).redirect(`/organizations/${organizationId}`);
    }

    // Chk if user exist in db, and if added to organization
    database.findRegisteredUser(db, userEmail)
      .then(userId => {
        if (userId) {
          return database.findUserInOrganization(db, userId, organizationId)
            .then(data => {
              const user = data.rows[0];
              if (user) {
                database.resSendError(res, organizationId);
              } else {
                return database.addUserToOrganization(db, userId, organizationId)
                  .then(data => {
                    res.status(200).send({
                      result: 'redirect',
                      url:`/organization/${organizationId}`
                    });
                  });
              }
            });
        } else {
          database.resSendError(res, organizationId);
        }
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // Delete User
  router.delete("/:organization_id/:user_id/delete", (req, res) => {
    const organizationId = req.params.organization_id;
    const userId = req.params.user_id;
    database.deleteUser(db, organizationId, userId)
      .then(data => {
        res.redirect(`/organizations/${organizationId}`);
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  //give 404 if non logged in user enter randomly in the address bar
  router.use((req, res) => {
    return res.redirect('/organizations/error');
  });

  return router;
};
