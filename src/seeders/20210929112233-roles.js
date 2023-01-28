"use strict";
const Role = require("../models").Role;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roleID = await queryInterface.rawSelect(
      "roles",
      {
        where: { id: 1 },
      },
      ["id"]
    );
    if (!roleID) {
      let data = [
        {
          name: "Super Admin",
        },
        {
          name: "Admin",
        },
        {
          name: "User",
        },
      ];
      return await Role.bulkCreate(data);
    }
    console.log("Role seed has already been performed");
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
