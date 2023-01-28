import User from "../models/user";
import logger from "../utils/logger";
import constants from "../constants/constants";

const { v4: uuidv4 } = require("uuid");

const getAllUsers = () => {
  return User.findAll({ where: { status: constants.STATUS_TRUE } });
};

const getUser = (id) => {
  return User.findByPk(id);
};

const createUser = async (body) => {
  return await User.build(body)
    .save()
    .then((data) => data)
    .catch((err) => {
      logger.error("Error on creating new user ", err);
    });
};

const updateUser = async (id, body) => {
  return await User.update(body, {
    where: {
      id,
    },
  })
    .then((data) => data)
    .catch((err) => {
      logger.error("Error on creating new user ", err);
    });
};

const getUserbyEmail = (email) => {
  return User.findOne({
    where: {
      email,
    },
  });
};

const changePassword = async (id, password) => {
  const user = await User.findOne({ where: { id } });

  return user.update({ password });
};

const forgotPassword = async (userToRecover) => {
  const resetToken = uuidv4();

  return userToRecover.update({ reset_token: resetToken });
};

const resetPassword = (userDetail, password) => {
  return userDetail.update({ reset_token: null, password });
};

export {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  getUserbyEmail,
  changePassword,
  forgotPassword,
  resetPassword,
};
