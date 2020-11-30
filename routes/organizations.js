const express = require('express');
const router  = express.Router();
const path = require('path');
const { isUrl } = require('../db/helpers/organizations/helper_functions');
const database = require('../db/helpers/organizations/export_all');

module.exports = (db) => {

  //=====ORGANIZATIONS=====//

  //User sees all the organizations user belongs to
  router.get("/", (req, res) => {
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
  router.get("/:organization_id/sites", (req, res) => {
    const orgId = req.params.organization_id;

    database.getSites(db, orgId)
      .then(sites => {
        res.render("sites", { sites });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  //=====NEW ORGANIZATION=====//

  router.get("/new", (req, res) => {
    res.render("./organizations/organizations_new");
    // res.sendFile('/vagrant/passwordkeeper/public/organizations_new.html');
  });


  // User creates new organization
  router.post("/", (req, res) => {
    const userId = req.session.user_id;
    const orgName = req.body.name;
    const logoUrl = req.body.logo_url;

    if (!orgName) {
      return res.status(406).redirect("/organizations/new");
    }

    if (logoUrl && !isUrl(logoUrl)) {
      return res.status(406).redirect("/organizations/new");
    }

    database.createOrganization(db, orgName, logoUrl)
      .then(orgId => {
        return database.linkUserToOrganization(db, userId, orgId)
          .then(data => {
            res.redirect("/organizations");
          });
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });

  });

  //=====EDIT ORGANIZATION & USERS=====//

  router.get("/:organization_id", (req, res) => {
    const organizationId = req.params.organization_id;
    const userId = req.session.user_id;

    database.getOrganization(db, userId, organizationId)
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
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });

  // User edit organization details
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

  // Add users
  router.put("/:organization_id", (req, res) => {
    const userEmail = req.body.email;
    const organizationId = req.params.organization_id;

    if (!userEmail) {
      return res.status(406).redirect(`/organizations/${organizationId}`);
    }

    database.findRegisteredUser(db, userEmail)
      .then(userId => {
        if (userId) {
          return database.findUserInOrganization(db, userId, organizationId)
            .then(data => {
              const user = data.rows[0];
              if (user) {
                return res.status(406).redirect(`/organizations/${organizationId}`);
              } else {
                return database.addUserToOrganization(db, userId, organizationId)
                  .then(data => {
                    res.redirect(`/organizations/${organizationId}`);
                  });
              }
            });
        } else {
          return res.status(406).redirect(`/organizations/${organizationId}`);
        }
      })
      .catch(err => {
        res
          .status(500)
          .send(err);
      });
  });


  // Delete user
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

  return router;
};
