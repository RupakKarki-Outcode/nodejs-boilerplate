"use strict";

const jwt = require("jsonwebtoken");

const config = require("../config/loginConfig");
const { User } = require("../models");
import logger from "../utils/logger";

const getUniqueKeyFromBody = (body) => {
  let uniqueKey = body.email;
  if (typeof uniqueKey === "undefined") {
    if (typeof body.email != "undefined") {
      uniqueKey = body.email;
    } else {
      uniqueKey = null;
    }
  }

  return uniqueKey;
};

const authUser = async (userInfo, callback) => {
  //returns token
  let uniqueKey;

  uniqueKey = await getUniqueKeyFromBody(userInfo);

  if (!uniqueKey) return callback(new Error("Please enter an email to login"));

  if (!userInfo.password)
    return callback(new Error("Please enter a password to login"));

  await User.findOne({
    where: {
      email: uniqueKey,
    },
  })
    .then(async (user) => {
      if (user === null) {
        return callback("Not registered");
      } else {
        const result = await user.correctPassword(userInfo.password);
        if (result) {
          await user
            .update({
              reset_token: null,
            })
            .then(async () => {
              const { token, expiration } = issueToken(user.id);
              callback(null, {
                message: "Login successful",
                token,
                expiration,
                user,
              });
            });
        } else {
          return callback(null, { response: "errors" });
        }
      }
    })
    .catch((err) => logger.error("Error: " + err));
};

const issueToken = (userId) => {
  const expiration = parseInt(config.login.jwtExpiration);
  const token =
    "Bearer: " +
    jwt.sign({ user_id: userId }, config.login.jwtEncryption, {
      expiresIn: expiration,
    });
  return { token, expiration };
};

export { getUniqueKeyFromBody, authUser, issueToken };
