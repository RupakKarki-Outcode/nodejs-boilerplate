"use strict";
const User = require("../models").User;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userID = await queryInterface.rawSelect(
      "users",
      {
        where: { id: 1 },
      },
      ["id"]
    );
    if (!userID) {
      let data = [
        {
          name: "Super Admin",
          password: "Password@123",
          email: "sa@outcodesoftware.com",
          phone: "9849123456",
          role_id: 1,
        },
      ];
      return await User.bulkCreate(data);
    }
    console.log("User seed has already been performed");
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
