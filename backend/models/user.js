"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ company, notification }) {
      // define association here
      this.hasMany(company, { as: "company", foreignKey: "company_id" });
      this.hasMany(notification, {
        as: "notification",
        foreignKey: "notification_id",
      });
    }
  }
  user.init(
    {
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
      signature: {
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
      nonce: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: () => Math.floor(Math.random() * 1000000), // Initialize with a random nonce
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
      title: {
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
      notification_token: {
        type: DataTypes.STRING,
      },
      users_total_clicks: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      countryCode: {
        type: DataTypes.STRING,
      },
      addnote: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      preference1: {
        type: DataTypes.STRING,
      },
      preference2: {
        type: DataTypes.STRING,
      },
      total_unique_visitors: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      commission: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "user",
    }
  );
  return user;
};
