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
      queryInterface.addColumn("chapters", "duration", {
        type: DataTypes.STRING,
      }),
      queryInterface.addColumn("chapters", "description", {
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
      queryInterface.removeColumn("chapters", "duration"),
      queryInterface.removeColumn("chapters", "description"),
    ]);
  },
};
