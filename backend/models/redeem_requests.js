"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class redeem_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  redeem_request.init(
    {
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
    },
    {
      sequelize,
      modelName: "redeem_request",
    }
  );
  return redeem_request;
};
