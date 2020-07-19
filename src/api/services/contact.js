const SimpleSchema = require("simpl-schema");
const isEmpty = require("lodash/isEmpty");
const intersectionBy = require("lodash/intersectionBy");
const omit = require("lodash/omit");
const orderBy = require("lodash/orderBy");
const ServerError = require("../../lib/error");
const db = require("../db");
const auth = require("../auth");

const authSchema = {
  authorization: String,
  deviceToken: String,
  fingerPrint: String,
};

/**
 * @param {Object} options
 * @param {Object} options.body Contact object that needs to be stored
 * @throws {Error}
 * @return {Promise}
 */
module.exports.addNewContact = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  try {
    new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.email,
      },
      mobile: {
        type: String,
      },
      firstName: String,
      lastName: String,
      ...authSchema,
    }).validate(options.body || {});
  } catch (error) {
    throw new ServerError({
      status: 422,
      error: error.details.map((obj) => omit(obj, ["type", "regExp"])), // only return the error details
    });
  }

  options.body.createdAt = Date.now();

  db.get("contacts")
    .push(omit(options.body, ["authorization", "deviceToken"]))
    .write();

  return {
    status: 200,
    data: options.body,
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findUserContacts = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  try {
    new SimpleSchema({
      pageNum: String,
      character: {
        type: String,
        optional: true,
      },
      ...authSchema,
    }).validate(options.body || {});
  } catch (error) {
    throw new ServerError({
      status: 422,
      error: error.details.map((obj) => omit(obj, ["type", "regExp"])), // only return the error details
    });
  }

  const contacts = db
    .get("contacts")
    .filter({ fingerPrint: options.body.fingerPrint })
    .value();

  return {
    status: 200,
    data: contacts,
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.recentContacts = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  try {
    new SimpleSchema(authSchema).validate(options.body || {});
  } catch (error) {
    throw new ServerError({
      status: 422,
      error: error.details.map((obj) => omit(obj, ["type", "regExp"])), // only return the error details
    });
  }

  const contacts = db
    .get("contacts")
    .filter({ fingerPrint: options.body.fingerPrint })
    .orderBy(["createdAt"], ["desc"])
    .take(5)
    .value();

  return {
    status: 200,
    data: contacts,
  };
};

/**
 * @param {Object} options
 * @param {Integer} options.amount Amount of the bid
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findSharedUserContacts = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  try {
    new SimpleSchema({
      ...authSchema,
      associatedUserFingerPrint: String,
    }).validate(options.body || {});
  } catch (error) {
    throw new ServerError({
      status: 422,
      error: error.details.map((obj) => omit(obj, ["type", "regExp"])), // only return the error details
    });
  }

  // Ensure
  if (options.body.associatedUserFingerPrint === options.body.fingerPrint)
    throw new ServerError({
      status: 422,
      error:
        "associatedUserFingerPrint cannot be similar to authenticated user fingerprint",
    });

  const authenticatedUserContacts = db
    .get("contacts")
    .filter({ fingerPrint: options.body.fingerPrint })
    .value();

  const associatedUserContacts = db
    .get("contacts")
    .filter({ fingerPrint: options.body.associatedUserFingerPrint })
    .value();

  const contacts = intersectionBy(
    authenticatedUserContacts,
    associatedUserContacts,
    "mobile"
  );

  return {
    status: 200,
    data: contacts,
  };
};
