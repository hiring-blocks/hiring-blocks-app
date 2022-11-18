"use strict";

const { STRING, INTEGER } = require("sequelize/types");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("users", {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      referral_code: {
        type: DataTypes.STRING,
      },
      full_name: {
        type: DataTypes.STRING,
      },
      mobile_no: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.STRING,
      },
      user_type: {
        type: DataTypes.STRING,
      },
      device: {
        type: DataTypes.STRING,
      },
      ip_address: {
        type: DataTypes.STRING,
      },
      time: {
        type: DataTypes.STRING,
      },
      otp: {
        type: DataTypes.STRING,
      },
      token: {
        type: DataTypes.STRING,
      },
      wallet_address: {
        type: DataTypes.STRING,
      },
      signature: {
        type: DataTypes.STRING,
      },
      nonce: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: () => Math.floor(Math.random() * 1000000), // Initialize with a random nonce
      },
      notification_token: {
        type: DataTypes.STRING,
      },
      users_total_clicks: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      total_unique_visitors: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      countryCode: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      commission: {
        type: DataTypes.FLOAT,
      },
      resume: {
        type: DataTypes.STRING,
      },
      profile_picture: {
        type: DataTypes.STRING,
      },
      cover_picture: {
        type: DataTypes.STRING,
      },
      experience: {
        type: DataTypes.JSONB,
      },
      description: {
        type: DataTypes.STRING,
      },
      preference1: {
        type: DataTypes.STRING,
      },
      preference2: {
        type: DataTypes.STRING,
      },
      skills: {
        type: DataTypes.JSONB,
      },
      education: {
        type: DataTypes.JSONB,
      },
      other_info: {
        type: DataTypes.JSONB,
      },
      certificates: {
        type: DataTypes.JSONB,
      },
      addnote: {
        type: DataTypes.STRING,
      },
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
    await queryInterface.dropTable("users");
  },
};
