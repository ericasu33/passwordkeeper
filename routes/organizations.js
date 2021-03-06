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
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
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
        return database.findUserEmail(db, userId)
          .then(email => {
            const templateVars = {
              organizations,
              email,
            };
            res.render("./organizations/organizations", templateVars);
          });
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
    
    database.getUserForOrganization(db, userId, orgId)
      .then(userArr => {
        if (userArr.length < 1) {
          return res.redirect("/organizations");
        }

        const user = userArr[0];
        const email = user.email;
        const admin = user.admin_privileges;
        const sites =  database.getSites(db, orgId);
        const categories = database.getCategories(db);
        return Promise.all([sites, categories, email, admin])
          .then(([sites, categories, email, admin]) => {
            const templateVars = {
              sites,
              categories,
              orgId,
              email,
              admin,
            };
            return res.render("sites", templateVars);
          });
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

    if (!orgName) {
      return res.redirect("/organizations/new");
    }

    if (logoUrl && !isUrl(logoUrl)) {
      return res.redirect("/organizations/new");
    }

    database.createOrganization(db, orgName, logoUrl)
      .then(orgId => {
        return database.linkUserToOrganization(db, userId, orgId)
          .then(data => {
            res.status(200).send({
              result: 'redirect',
              url:'/organizations'});
          });
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
    database.getUserForOrganization(db, userId, organizationId)
      .then(userArr => {
        if (userArr.length < 1) {
          return res.redirect("/organizations");
        }

        const user = userArr[0];
        
        if (user.admin_privileges === false) {
          return res.redirect("/organizations");
        }

        return database.getOrganization(db, userId, organizationId)
          .then(organization => {
            const orgId = organization.organization_id;
            const users = database.getUsersForOrganization(db, orgId);
            const email = user.email;

            return Promise.all([users, email])
              .then(([users, email]) => {
                const templateVars = {
                  organization,
                  users,
                  email,
                };
                res.render("./organizations/organization_edit", templateVars);
              });
          });
      })
      .catch(err => {
        return res.redirect('/organizations/error');
      });
  });

  // Edit organization details
  router.post("/:organization_id", (req, res) => {
    const organizationId = req.params.organization_id;
    const organizationName = req.body.orgName;
    const logoUrl = req.body.logo_url;

    if (!organizationName && !logoUrl) {
      return res.redirect(`/organizations/${organizationId}`);
    }

    if (logoUrl && !isUrl(logoUrl)) {
      return res.redirect(`/organizations/${organizationId}`);
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
      return res.redirect(`/organizations/${organizationId}`);
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
                      url:`/organizations/${organizationId}`
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
          .status(406)
          .send(err);
      });
  });

  // Delete User
  router.delete("/:organization_id/:user_id/delete", (req, res) => {
    const organizationId = req.params.organization_id;
    const userId = req.params.user_id;
    database.deleteUser(db, userId, organizationId)
      .then(data => {
        res.status(200).send({
          result: 'redirect',
          url:`/organizations/${organizationId}`
        });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // Transfer Ownership
  router.put("/:organization_id/transfer", (req, res) => {
    const organizationId = req.params.organization_id;
    const transferorId = req.session.user_id;
    const transfereeId = Number(req.body.user_id);
    const userName = req.body.user_name;
    const userEmail = req.body.email;

    // Validation
    database.getUsersForOrganization(db, organizationId)
      .then(users => {
        for (const user of users) {
          if (transfereeId === user.id && userName === user.name && userEmail === user.email) {
            return database.giveOwnership(db, transfereeId, organizationId)
              .then(data => {
                return database.removeOwnership(db, transferorId, organizationId)
                  .then(data => {
                    res.status(200).send({
                      result: 'redirect',
                      url:`/organizations/${organizationId}`
                    });
                  });
              });
          }
        }
        database.resSendError(res, organizationId);
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // Give 404 if non logged in user enter randomly in the address bar
  router.use((req, res) => {
    return res.redirect('/organizations/error');
  });

  return router;
};
