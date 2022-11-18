"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("redeem_requests", {
      redeem_request_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: DataTypes.STRING,
      email: DataTypes.STRING,
      gpay_number: DataTypes.STRING,
      phonepe_number: DataTypes.STRING,
      paytm_number: DataTypes.STRING,
      upi_number: DataTypes.STRING,
      upi_id: DataTypes.STRING,
      account_number: DataTypes.STRING,
      account_name: DataTypes.STRING,
      account_ifsc: DataTypes.STRING,
      method: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      redeem_amount: DataTypes.STRING,
      from_ip: DataTypes.STRING,
      from_browser: DataTypes.STRING,
      time: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("redeem_requests");
  },
};
