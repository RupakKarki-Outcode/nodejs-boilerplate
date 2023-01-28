import Joi from "joi";
import j2s from "joi-to-swagger";

import validate from "../utils/validate";

// password validation pattern
const pattern =
  /^(?=.*[\d])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;

const createUserSchema = Joi.object({
  name: Joi.string().label("Name").max(225).required(),
  email: Joi.string().label("Email").required(),
  password: Joi.string().label("Password").regex(pattern).required(),
  confirm_password: Joi.string()
    .label("Confirm Password")
    .valid(Joi.ref("password"))
    .required(),
  phone: Joi.string().label("Phone").max(20).optional(),
  status: Joi.boolean().label("Status").optional(),
  image_url: Joi.string().label("Image").optional(),
  reset_token: Joi.string().label("Token").optional(),
  role_id: Joi.number().label("Role").optional(),
  created_by: Joi.number().label("Created By").required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().label("Name").max(225).optional(),
  email: Joi.string().label("Email").optional(),
  phone: Joi.string().label("Phone").max(20).optional(),
  status: Joi.boolean().label("Status").optional(),
  image_url: Joi.string().label("Image").optional(),
  role_id: Joi.number().label("Role").optional(),
  updated_by: Joi.number().label("Updated By").required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().label("Email").required(),
  base_url: Joi.string().label("URL").required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().label("Reset Token").required(),
  password: Joi.string().label("Password").regex(pattern).required(),
  confirm_password: Joi.string()
    .label("Confirm Password")
    .valid(Joi.ref("password"))
    .required(),
});

/**
 * Validate create user request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
async function userInsertValidator(req, res, next) {
  return validate(req.body, createUserSchema)
    .then(() => next())
    .catch((err) => next(err));
}

/**
 * Validate update user request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
async function userUpdateValidator(req, res, next) {
  return validate(req.body, updateUserSchema)
    .then(() => next())
    .catch((err) => next(err));
}

/**
 * Validate forgot password request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
async function forgotPasswordValidator(req, res, next) {
  return validate(req.body, forgotPasswordSchema)
    .then(() => next())
    .catch((err) => next(err));
}

/**
 * Validate reset password request.
 *
 * @param   {Object}   req
 * @param   {Object}   res
 * @param   {Function} next
 * @returns {Promise}
 */
async function resetPasswordValidator(req, res, next) {
  return validate(req.body, resetPasswordSchema)
    .then(() => next())
    .catch((err) => next(err));
}

// swagger definitions
export const { swagger: CreateUserDef } = j2s(createUserSchema);
export const { swagger: UpdateUserDef } = j2s(updateUserSchema);
export const { swagger: ForgotPasswordDef } = j2s(forgotPasswordSchema);
export const { swagger: ResetPasswordDef } = j2s(resetPasswordSchema);

export {
  userInsertValidator,
  userUpdateValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
