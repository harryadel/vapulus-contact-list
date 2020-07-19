const express = require("express");
const contact = require("../services/contact");
const auth = require("../auth");

const router = new express.Router();

/**
 * Add a new contact
 */
router.post("/addContact", auth.required, async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await contact.addNewContact(options);
    res.status(200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Get all user contacts
 */
router.get("/getList", auth.required, async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await contact.findUserContacts(options);
    res.status(200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Get user's recent contact list
 */

router.get("/getRecentList", auth.required, async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await contact.recentContacts(options);
    res.status(200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Get shared contacts between two users
 */
router.get("/getSharedContacts", auth.required, async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await contact.findSharedUserContacts(options);
    res.status(200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
