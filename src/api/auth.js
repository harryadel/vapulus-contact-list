const pick = require("lodash/pick");
const isEmpty = require("lodash/isEmpty");
const db = require("./db");
const { default: SimpleSchema } = require("simpl-schema");

const auth = {
  required: (req, res, next) => {
    const authParams = pick(req.body, [
      "authorization",
      "deviceToken",
      "fingerPrint",
    ]);

    try {
      new SimpleSchema({
        authorization: String,
        deviceToken: String,
        fingerPrint: String,
      }).validate(authParams);

      let users = db.get("users").find().value(authParams);
      if (isEmpty(users)) throw null; // move to the catch statement
      next();
    } catch (err) {
      return res.status(401).json({
        status: 401,
        message: "UNAUTHORIZED",
      });
    }
  },
};

module.exports = auth;
