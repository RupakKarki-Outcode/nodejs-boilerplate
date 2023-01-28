import {
  conflict,
  notFound,
  unauthorized,
  unprocessableEntity,
} from "../middlewares/errorHandler";

import { userService, authService } from "../services";

import logger from "../utils/logger";
import HttpStatus from "http-status-codes";
import customMessages from "../constants/customMessages";
import { sendMail } from "../utils/email";

/**
 * List of User
 */
const fetchAll = async (req, res, next) => {
  // #swagger.tags = ['User']
  userService
    .getAllUsers()
    .then((data) => res.json({ data }))
    .catch((err) => {
      logger.error(customMessages.ERROR_LISTING_USERS);
      next(err);
    });
};

/**
 * show User
 */
const show = async (req, res) => {
  // #swagger.tags = ['User']

  const userId = req.params.id;

  const userDetail = await userService.getUser(userId);

  if (!userDetail) {
    logger.error(`${customMessages.ERROR_FETCHING_USER_ID} ${userId}`);
    return notFound(req, res, customMessages.NO_USER_FOUND);
  }

  return res.json({ data: userDetail });
};

/**
 * Create new user
 */

const createUser = async (req, res, next) => {
  // #swagger.tags = ['User']

  /*  #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/definitions/CreateUser" },
      }
  */

  const checkUserExists = await userService.getUserbyEmail(req.body.email);

  if (checkUserExists) {
    return conflict(req, res, customMessages.EMAIL_ALREADY_USED);
  }

  createUser(req.body)
    .then((data) => res.status(HttpStatus.CREATED).json({ data }))
    .catch((err) => {
      logger.error(customMessages.ERROR_CREATING_USER);
      next(err);
    });
};

/**
 * User Login
 */
const authLogin = async (req, res) => {
  // #swagger.tags = ['Auth']
  /*  #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/definitions/Login" },
      }
  */
  await authService.authUser(req.body, (err, data) => {
    if (err || data.response === "errors") {
      return unauthorized(req, res, customMessages.ERROR_SIGN_IN);
    }
    res.json({ data });
  });
};

/**
 * Get auth detail
 */

const getAuthDetail = async (req, res) => {
  // #swagger.tags = ['Auth']

  // get auth detail from req (middleware)
  const { user } = req;

  res.json({ data: user });
};

/**
 * Update user
 */

const updateUser = async (req, res, next) => {
  // #swagger.tags = ['User']
  /*  #swagger.requestBody = {
          required: true,
          schema: { ref: "#/definitions/CreateUser" },
       }
    */

  const { id } = req.params;
  const checkUserExists = await userService.getUser(id);

  if (!checkUserExists) {
    return notFound(req, res, customMessages.NO_USER_FOUND);
  }

  userService
    .updateUser(id, req.body)
    .then((data) => {
      if (data[0] !== 1) {
        return unprocessableEntity(
          req,
          res,
          customMessages.FAILURE_USER_UPDATE
        );
      }
      return res.json({
        data: { message: customMessages.SUCCESS_USER_UPDATE },
      });
    })
    .catch((err) => {
      logger.error(customMessages.FAILURE_USER_UPDATE);
      next(err);
    });
};

/**
 * change password
 */
const changePassword = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  /*  #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/definitions/ChangePassword" },
      }
  */

  const { user } = req;
  const { old_password: oldPassword, password } = req.body;
  const validatePassword = await user.correctPassword(oldPassword);

  if (!validatePassword)
    return unauthorized(req, res, customMessages.INVALID_PASSWORD);

  userService
    .changePassword(user.id, password)
    .then((data) => {
      if (!data.id) {
        return unprocessableEntity(
          req,
          res,
          customMessages.FAILURE_PASSWORD_UPDATE
        );
      }
      return res.json({
        data: { message: customMessages.SUCCESS_PASSWORD_UPDATE },
      });
    })
    .catch((err) => {
      logger.error(customMessages.FAILURE_PASSWORD_UPDATE);
      next(err);
    });
};

/**
 * forgot password
 */

const forgotPassword = async (req, res, next) => {
  // #swagger.tags = ['User']
  /*  #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/definitions/ForgotPassword" },
      }
  */

  const { email, base_url: url } = req.body;
  const isValidUser = await userService.getUserbyEmail(email);

  if (!isValidUser) {
    return unprocessableEntity(req, res, customMessages.INVALID_EMAIL);
  }

  let resetUrl = url;
  resetUrl +=
    url[url.length - 1] === "/"
      ? `api/users/${isValidUser.id}/reset-password`
      : `/api/users/${isValidUser.id}/reset-password`;

  userService
    .forgotPassword(isValidUser)
    .then((data) => {
      if (!data.id) {
        return unprocessableEntity(
          req,
          res,
          customMessages.FORGOT_PASSWORD_FAILURE
        );
      }

      resetUrl += `?token=${data.reset_token}`;

      // TO-DO: fix body for email service later
      sendMail(
        isValidUser.email,
        customMessages.EMAIL_SUBJECT_RESET,
        resetUrl,
        null,
        (err) => {
          if (err) {
            logger.error(`${customMessages.SMTP_ERROR}, err: ${err}`);
            return unprocessableEntity(req, res, customMessages.SMTP_ERROR);
          }
        }
      );

      return res.json({
        data: {
          message: customMessages.FORGOT_PASSWORD_SUCCESS,
          reset_url: resetUrl,
        },
      });
    })
    .catch((err) => {
      logger.error(customMessages.FORGOT_PASSWORD_FAILURE);
      next(err);
    });
};

/**
 * verify reset token
 */

const verifyResetToken = async (req, res) => {
  // #swagger.tags = ['User']

  const { id } = req.params;
  const { token } = req.query;

  const isValidUser = await userService.getUser(id);

  if (!isValidUser) {
    return unprocessableEntity(req, res, customMessages.INVALID_EMAIL);
  }

  if (token === isValidUser.reset_token)
    return res.json({ data: { message: "valid token" } });

  return unauthorized(req, res, "Invalid user / token");
};

/**
 * change password
 */

const resetPassword = async (req, res, next) => {
  // #swagger.tags = ['User']
  /*  #swagger.requestBody = {
          required: true,
          schema: { $ref: "#/definitions/ResetPassword" },
        }
  */
  const { id } = req.params;
  const { token, password } = req.body;

  const isValidUser = await userService.getUser(id);
  if (!isValidUser) {
    return unprocessableEntity(req, res, customMessages.INVALID_EMAIL);
  }

  if (isValidUser.reset_token !== token) {
    return unauthorized(req, res, customMessages.INVALID_TOKEN);
  }

  userService
    .resetPassword(isValidUser, password)
    .then((data) => {
      if (!data.id) {
        return unprocessableEntity(
          req,
          res,
          customMessages.RESET_PASSWORD_FAILURE
        );
      }

      sendMail(
        isValidUser.email,
        customMessages.EMAIL_SUBJECT_RESET_SUCCESS,
        customMessages.EMAIL_BODY_RESET_SUCCESS,
        null,
        (err) => {
          if (err) {
            logger.error(`${customMessages.SMTP_ERROR}, err: ${err}`);
            return unprocessableEntity(req, res, customMessages.SMTP_ERROR);
          }
        }
      );

      return res.json({
        data: { message: customMessages.RESET_PASSWORD_SUCCESS },
      });
    })
    .catch((err) => {
      logger.error(customMessages.RESET_PASSWORD_FAILURE);
      next(err);
    });
};

export {
  fetchAll,
  show,
  createUser,
  authLogin,
  getAuthDetail,
  updateUser,
  verifyResetToken,
  resetPassword,
  changePassword,
  forgotPassword,
};
