'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      name: {
        type: DataTypes.STRING,
      },
      created_by: {
        type: DataTypes.INTEGER,
      },
      updated_by: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'roles',
    }
  );

  return Role
};
