"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: DataTypes.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("modules", "duration", {
        type: DataTypes.STRING,
      }),
      queryInterface.addColumn("modules", "description", {
        type: DataTypes.STRING(1000),
      }),
    ]);
  },

  down: async (queryInterface, DataTypes) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn("modules", "duration"),
      queryInterface.removeColumn("modules", "description"),
    ]);
  },
};
