"use strict";
const crypto = require("crypto");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue("password");
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      image_url: {
        type: DataTypes.STRING,
      },
      reset_token: {
        type: DataTypes.STRING,
      },
      role_id: {
        type: DataTypes.INTEGER,
      },
      created_by: {
        type: DataTypes.INTEGER,
      },
      updated_by: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "users",
    }
  );

  User.prototype.correctPassword = function (candidatePwd) {
    return User.encryptPassword(candidatePwd) === this.password();
  };

  User.generateSalt = function () {
    return crypto.randomBytes(16).toString("base64");
  };

  User.encryptPassword = function (plainText) {
    return crypto.createHash("RSA-SHA256").update(plainText).digest("hex");
  };

  const setPassword = (user) => {
    if (user.changed("password")) {
      user.password = User.encryptPassword(user.password());
    }
  };

  User.beforeCreate(setPassword);
  User.beforeUpdate(setPassword);
  User.beforeBulkCreate((users) => {
    users.forEach(setPassword);
  });

  return User;
};
