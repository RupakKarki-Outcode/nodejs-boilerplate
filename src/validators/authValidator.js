import Joi from "joi";
import j2s from "joi-to-swagger";

import validate from "../utils/validate";

// password validation pattern
const pattern =
  /^(?=.*[\d])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;

// Validation schema
const loginSchema = Joi.object({
  email: Joi.string().label("Email").required(),
  password: Joi.string().label("Password").min(8).required(),
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().label("Old Password").required(),
  password: Joi.string().label("Password").regex(pattern).required(),
  confirm_password: Joi.string()
    .label("Confirm Password")
    .valid(Joi.ref("password"))
    .required(),
});

/**
 * Validate user's login request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
async function authLoginValidator(req, res, next) {
  return validate(req.body, loginSchema)
    .then(() => next())
    .catch((err) => next(err));
}

/**
 * Validate change password request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
async function changePasswordValidator(req, res, next) {
  return validate(req.body, changePasswordSchema)
    .then(() => next())
    .catch((err) => next(err));
}

// exports for swagger definitions
export const { swagger: LoginDef } = j2s(loginSchema);
export const { swagger: ChangePasswordDef } = j2s(changePasswordSchema);

export { authLoginValidator, changePasswordValidator };
